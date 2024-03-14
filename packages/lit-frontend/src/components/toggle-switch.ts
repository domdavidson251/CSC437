import { css, html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("toggle-switch")
export class ToggleSwitchElement extends LitElement {
  @property({ reflect: true, type: Boolean })
  on: boolean = false;

  @property({ reflect: true})
  mode: 'light' | 'dark' = 'light';

  render() {
    return html`<label>
      <slot>Label</slot>
      <span class="slider">
        <input type="checkbox" @change=${this._handleChange} />
      </span>
    </label>`;
  }

  static styles = css`
    :host {
      display: block;
    }
    label {
      display: flex;
      width: 100%;
      align-items: center;
      line-height: 2em;
    }
    .slider {
      display: inline-block;
      border: 1px solid var(--color-brand);
      border-radius: 0.75em;
      background-color: var(--color-background-control);
      height: 1.5em;
      width: 2.75em;
      position: relative;
      transition: background-color
        var(--time-transition-control);
    }
    .slider:has(input:checked) {
      background-color: var(--color-brand);
    }
    input {
      appearance: none;
      background-color: var(--header-text-color);
      border-radius: 50%;
      width: 1.25em;
      height: 1.25em;
      vertical-align: center;
      position: absolute;
      left: 0;
      transition: left var(--time-transition-control);
    }
    input:checked {
      left: 2em;
    }
  `;

  _handleChange(ev: Event) {
    const target = ev.target as HTMLInputElement;
    this.on = target?.checked;
    this.mode = this.mode === 'light' ? 'dark': 'light';
    document.body.classList.toggle('dark-mode', this.mode === 'dark');
  }
}