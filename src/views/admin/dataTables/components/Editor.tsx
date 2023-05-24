import { createRoot } from "react-dom/client";
import { NodeEditor } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
  ConnectionPlugin,
  Presets as ConnectionPresets
} from "rete-connection-plugin";
import {
  ReactRenderPlugin,
  Presets,
  ReactArea2D
} from "rete-react-render-plugin";
import {
  AutoArrangePlugin,
  Presets as ArrangePresets
} from "rete-auto-arrange-plugin";
import { DataflowEngine, ControlFlowEngine } from "rete-engine";
import {
  ContextMenuExtra,
  ContextMenuPlugin,
  Presets as ContextMenuPresets
} from "rete-context-menu-plugin";
import {
  DebugChat,
  Message,
  OnMessage,
  MatchMessage,
  SendMessage
} from "../nodes";
import { ActionSocket, TextSocket } from "../sockets";
import { Schemes } from "../types";
import { Connection } from "../connection";
import { ActionSocketComponent } from "../ui/ActionSocket";
import { TextSocketComponent } from "../ui/TextSocket";
import { ActionConnectionComponent } from "../ui/ActionConnection";
import { TextConnectionComponent } from "../ui/TextConnection";
import { CustomNodeComponent } from "../ui/CustomNode";
import { getConnectionSockets } from "../utils";
import { addCustomBackground } from "../ui/background";
import { CustomInputControl } from "../nodes/message";
import { CustomInputComponent } from "../nodes/message";

type AreaExtra = ReactArea2D<any> | ContextMenuExtra<Schemes>;

export async function createEditor(
  container: HTMLElement,
  log: (text: string, type: "info" | "error") => void
) {
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const render = new ReactRenderPlugin<Schemes>({ createRoot });
  const arrange = new AutoArrangePlugin<Schemes>();
  const dataflow = new DataflowEngine<Schemes>(({ inputs, outputs }) => {
    return {
      inputs: () =>
        Object.entries(inputs)
          .filter(([_, input]) => input.socket instanceof TextSocket)
          .map(([name]) => name),
      outputs: () =>
        Object.entries(outputs)
          .filter(([_, output]) => output.socket instanceof TextSocket)
          .map(([name]) => name)
    };
  });
  const engine = new ControlFlowEngine<Schemes>(({ inputs, outputs }) => {
    return {
      inputs: () =>
        Object.entries(inputs)
          .filter(([_, input]) => input.socket instanceof ActionSocket)
          .map(([name]) => name),
      outputs: () =>
        Object.entries(outputs)
          .filter(([_, output]) => output.socket instanceof ActionSocket)
          .map(([name]) => name)
    };
  });


  
  const contextMenu = new ContextMenuPlugin<Schemes, AreaExtra>({
    items: ContextMenuPresets.classic.setup([
      ["On message", () => new OnMessage()],
      ["Message", () => new Message("")],
      ["Match message", () => new MatchMessage("", dataflow)],
    ])
  });
  area.use(contextMenu);

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl()
  });

  render.addPreset(Presets.contextMenu.setup());
  render.addPreset(
    Presets.classic.setup({
      area,
      customize: {
        connection(data) {
          const { source, target } = getConnectionSockets(editor, data.payload);

          if (
            source instanceof ActionSocket ||
            target instanceof ActionSocket
          ) {
            return ActionConnectionComponent;
          }
          return TextConnectionComponent;
        },
        socket(data) {
          if (data.payload instanceof ActionSocket) {
            return ActionSocketComponent;
          }
          if (data.payload instanceof TextSocket) {
            return TextSocketComponent;
          }
          return Presets.classic.Socket;
        },
        node(data) {
          return CustomNodeComponent;
        },
        control(context) {
          if (context.payload instanceof CustomInputControl) {
            return CustomInputComponent;
          }
          return Presets.classic.Control;
        },
      }
    })
  );

  arrange.addPreset(ArrangePresets.classic.setup());

  connection.addPreset(ConnectionPresets.classic.setup());

  editor.use(engine);
  editor.use(dataflow);
  editor.use(area);
  area.use(connection);
  area.use(render);
  area.use(arrange);

  AreaExtensions.simpleNodesOrder(area);
  AreaExtensions.showInputControl(area);

  editor.addPipe((context) => {
    if (context.type === "connectioncreate") {
      const { data } = context;
      const { source, target } = getConnectionSockets(editor, data);

      if (!source.isCompatibleWith(target)) {
        log("Sockets are not compatible", "error");
        return;
      }
    }
    return context;
  });

  addCustomBackground(area);

  const onMessage = new OnMessage();
  const match = new MatchMessage(".*hello.*", dataflow);
  const message1 = new Message("Hello!");
  const message2 = new Message("ッ");




  const con1 = new Connection(onMessage, "exec", match, "exec");
  const con2 = new Connection(onMessage, "text", match, "text");

  await editor.addNode(onMessage);
  await editor.addNode(match);
  await editor.addNode(message1);
  await editor.addNode(message2);

  
  await editor.addConnection(con1);
  await editor.addConnection(con2);

  await arrange.layout();


  AreaExtensions.zoomAt(area, editor.getNodes());



  return {
    destroy: () => area.destroy()
  };
}