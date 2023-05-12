export {};

declare global {
  /**
   * Now declare things that go in the global namespace,
   * or augment existing declarations in the global namespace.
   */
  interface RoutesType {
    name: string;
    layout: string;
    icon: JSX.Element | string;
    path: string;
    secondary?: boolean;
	component: (props: MyEditorProps) => JSX.Element;
  }

  interface CustomRoutesType extends RoutesType {
    component: (props: MyEditorProps) => JSX.Element;
  }
}
