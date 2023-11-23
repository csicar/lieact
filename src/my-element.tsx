import { TemplateResult, render } from "lit";
import { html, FcApi, Fc, el } from "./lib.ts";

function TestElement(this: FcApi, { out }: { out: string }): TemplateResult<1> {
  const [a, setA] = this.useState(2);
  return html`<div
    @click=${() => {
      console.log(2), setA(a + 1);
    }}
  >
    s ${a} outside: ${out}
  </div>`;
}

const Hoc: Fc<{ children: TemplateResult<1> }> = function (
  this: FcApi,
  { children }: { children: TemplateResult<1> }
) {
  return html`<div>I man an enclosing element { ${children} }</div>`;
};

const App: Fc<{}> = function (this: FcApi, _props: {}) {
  const [out, setOut] = this.useState("asd");
  const [counter, setCounter] = this.useState([1, 2, 3]);

  return html`
    <button @click=${() => setOut(out + "2")}>update out</button>
    <ul>
      <li>
        first:
        ${(
          <Hoc>
            <TestElement out={out} />
          </Hoc>
        )}
      </li>
      <li>second: ${el(TestElement, { out: out + "asd" })}</li>
      <li>third: ${(<TestElement out="2" />)}</li>
    </ul>
    and here a dynamic list:
    <ul>
      ${counter.map(
        (c) =>
          html`<li>${c} outside. Inside: ${(<TestElement out={c + ""} />)}</li>`
      )}
    </ul>
    <button @click=${() => setCounter([...counter, counter.length + 1])}>
      add
    </button>
    <button @click=${() => setCounter(counter.slice(1))}>remove</button>
  `;
};

render(html`${el(App, {})}`, document.body);
