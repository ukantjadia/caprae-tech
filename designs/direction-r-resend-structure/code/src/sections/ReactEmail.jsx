// Block 07, "How it works". Keeps the windowed code/preview panel: steps on the left, a hairline scope document on the right.
// Spacing uses arbitrary px: the @theme redefines --spacing-4/8/12/16/... as px.
import content from '../../../../_shared/content.json'
import './tail.css'

const { h2, steps } = content.engagement
const FF = "font-abc-favorit [font-feature-settings:'ss01','ss04','ss05','ss11']"
const LINE = 'border-[#d6ebfd30]'

// Grey bars standing in for document text. Widths are arbitrary.
const Bars = ({ w }) => (
  <div className="flex flex-col gap-[10px]" aria-hidden="true">
    {w.map((x, i) => <div key={i} className="h-[6px] rounded-full bg-white/[0.07]" style={{ width: x }} />)}
  </div>
)

export default function ReactEmail() {
  return (
    <section id="how" data-block="07" className="mx-auto px-[24px] py-[48px] sm:py-[96px] max-w-5xl md:max-w-7xl">
      <div className="t-tile" aria-hidden="true" />
      <h2 className={`${FF} text-[3rem] md:text-[3.5rem] tracking-tighter leading-[120%] bg-[linear-gradient(to_bottom_right,#fff_30%,#ffffff80)] bg-clip-text text-transparent mb-[48px] text-center md:mb-[80px]`}>{h2}</h2>
      <div className={`rounded-3xl border ${LINE}`}>
        <header className={`flex h-[48px] items-center border-b ${LINE} px-[16px]`} aria-hidden="true">
          <div className="flex items-center gap-[8px]">
            {[0, 1, 2].map((i) => <div key={i} className="h-2.5 w-2.5 rounded-full border border-white/20" />)}
          </div>
        </header>
        <div className="flex w-full flex-col md:flex-row">
          <ol className={`m-0 flex list-none flex-col p-0 md:w-1/2 md:border-r ${LINE}`}>
            {steps.map((s, i) => (
              <li key={s.n} className={`flex gap-[20px] px-[24px] py-[32px] md:px-[40px] md:py-[48px] ${i ? `border-t ${LINE}` : ''}`}>
                <span className="font-commit-mono pt-[6px] text-xs text-[#6C6C6C]">{s.n}</span>
                <div>
                  <h3 className={`${FF} m-0 mb-[8px] text-2xl tracking-tight text-[#fcfdffef]`}>{s.title}</h3>
                  <p className="m-0 text-base leading-[1.6] text-ash-gray md:text-[1.125rem]">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="hidden w-full p-2.5 md:block md:w-1/2" aria-hidden="true">
            <div className="flex h-full min-h-[420px] items-center justify-center rounded-2xl" style={{ backgroundImage: 'radial-gradient(100% 50% at 50% 0%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 50%)' }}>
              <div className={`flex w-[62%] max-w-[340px] flex-col gap-[28px] rounded-xl border ${LINE} bg-[#0a0a0a] p-[32px]`}>
                <div className="h-[10px] w-[45%] rounded-full bg-white/[0.12]" />
                <Bars w={['100%', '92%', '78%']} />
                <div className={`border-t ${LINE}`} />
                <Bars w={['88%', '100%', '64%', '82%']} />
                <div className={`flex items-center justify-between border-t ${LINE} pt-[20px]`}>
                  <div className="h-[6px] w-[30%] rounded-full bg-white/[0.07]" />
                  <div className="h-[14px] w-[22%] rounded-md border border-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
