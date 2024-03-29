import { Component } from "../Component";
import { Source } from "../Enums";
import { PageConduitEvent } from "../Page";
import { Stack } from "../Stack";
import { maybe, setStyle } from "../Utils";

let currentSelection = "";

export class Text extends Component {
  /**
   * Text article element.
   * @type {HTMLElement}
   */
  public element: HTMLElement;

  /**
   * Text content element, when rendering in read mode.
   * @type {HTMLDivElement}
   */
  public content: HTMLDivElement;

  /**
   * Quill editor instance, when working in edit mode.
   * @type {Quill}
   */
  public quill: any;

  constructor(stack: Stack, data: any) {
    super(stack, data);

    this.area.append((this.element = document.createElement("article")));
    this.element.id = data.id;

    setStyle(this.element, { pointerEvents: "auto" });

    if (this.editing) {
      this.loadQuill();
    }

    this.page.on(PageConduitEvent.Quill, this.onQuillDelta);
  }

  /**
   * Create a quill instance.
   */
  private loadQuill() {
    this.quill = new this.page.Quill(this.element, {
      theme: "snow",
      placeholder: "Compose an epic...",
      modules: {
        toolbar: false
      }
    });

    // ### Selection Change
    // 1. Send a component edit selection when selection has changed.

    this.quill.on("selection-change", (range: any) => {
      if (range && this.id !== currentSelection) {
        currentSelection = this.id;
        this.edit();
      }
    });

    // ### Text Change
    // 1. Update the text, and html keys on the component.
    // 2. Send text, and html update events to all connected peers.

    this.quill.on("text-change", (delta: any, oldDelta: any, source: Source) => {
      if (source === Source.User) {
        const data = { content: this.quill.getContents(), delta };

        this.setSetting("text", data);
        this.setSetting("html", this.quill.root.innerHTML);

        this.page.send(PageConduitEvent.Quill, this.id, { data, html: this.quill.root.innerHTML });
      }
    });

    // ### Content
    // 1. Assign the initial component quill text.

    this.quill.setContents(this.getSetting("text", {}).content);
  }

  private onQuillDelta = (componentId: string, { data, html }: any) => {
    if (componentId === this.id) {
      if (this.editing) {
        this.quill.updateContents(data.delta);
      } else {
        this.setSetting("text", data);
        this.setSetting("html", html);
      }
    }
  };

  public render() {
    super.render();

    this.area.className = "display-flex";

    const [align, justify] = this.getSetting("layout", "top,center").split(",");
    setStyle(this.area, {
      alignItems: align,
      justifyContent: justify
    });

    setStyle(this.element, {
      color: "#262626",
      minWidth: this.getSetting("min", 280),
      maxWidth: this.getSetting("max", 762),
      width: "100%",
      fontSize: "1em",
      lineHeight: "1.71",
      ...maybe(this.data, "style", {})
    });

    if (this.editing) {
      // setStyle(this.quill.root, {
      //   display: "flex"
      // })
    } else {
      this.element.className = "ql-container ql-snow";

      if (!this.content) {
        this.content = document.createElement("div");
        this.content.className = "ql-editor";
        this.element.append(this.content);
      }

      this.content.innerHTML = this.getSetting("html");
    }
  }
}
