import {
  ChildPart,
  LitElement,
  TemplateResult,
  css,
  html as litHtml,
  render,
} from "lit";
import { customElement, property } from "lit/decorators.js";
import litLogo from "./assets/lit.svg";
import viteLogo from "/vite.svg";
import {
  AsyncDirective,
  DirectiveResult,
  directive,
} from "lit/async-directive.js";

export type Interpolation =
  | string
  | number
  | TemplateResult<1>
  | DirectiveResult;

export function html(
  strings: TemplateStringsArray,
  ...values: Interpolation[]
): TemplateResult<1> {
  return litHtml(strings, ...values);
}

export interface FcApi {
  useState: <T>(initial: T) => [T, (next: T) => void];
}

export type Fc<P> = (this: FcApi, props: P) => TemplateResult<1>;

export type UseState<T> = [T, (next: T) => void];

export class Component<P> extends AsyncDirective {
  initialized = false;
  state: any[] = [];
  currentIndex: number = 0;

  render(fc: Fc<P>, props: P, children: TemplateResult<1> | undefined) {
    const useState: <T>(initial: T) => UseState<T> = <T>(initial: T) => {
      if (!this.initialized) {
        this.state.push(initial);
      }

      const myIndex = this.currentIndex;
      this.currentIndex++;

      return [
        this.state[myIndex],
        (next: any) => {
          this.state[myIndex] = next;
          this.setValue(this.render(fc, props, children));
        },
      ];
    };
    const self = { useState };
    console.log(props);
    const res = fc.apply(self, [{ ...props, children }]);
    console.log(this.initialized, "state", this.state);
    this.initialized = true;
    this.currentIndex = 0;
    return res;
  }
}

export const el: <P>(
  fc: Fc<P & { children?: TemplateResult<1> }>,
  props: P,
  children?: TemplateResult<1>
) => DirectiveResult = directive<Component<P>>(Component);
