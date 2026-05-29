import { useState, useEffect, useCallback, useRef } from "react";

// ─── DESIGN TOKENS ──────────────────────────────────────────────────────────
const C = {
  bg: "#080b14", surface: "#0d1220", card: "#111827",
  border: "rgba(255,255,255,0.07)", borderHover: "rgba(99,102,241,0.4)",
  gold: "#f5c842", goldDim: "#a88a20",
  purple: "#7c3aed", purpleLight: "#a78bfa", purpleDim: "#4c1d95",
  blue: "#3b82f6", green: "#10b981", red: "#ef4444", orange: "#f59e0b",
  text: "#e2e8f0", muted: "#64748b", subtle: "#94a3b8",
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const QUESTS = [
  {
    id:"q1",title:"Welcome to Financial Freedom",category:"tutorial",icon:"🏛️",
    difficulty:1,xpReward:100,goldReward:50,requiredLevel:1,
    description:"Understand income, expenses, taxes and create your first zero-based budget.",
    questions:[
      {q:"You earn $45,000/year. After 25% taxes, what is your approximate monthly take-home?",options:["$1,875","$2,813","$3,750","$4,500"],correct:1,explanation:"$45,000 × 0.75 = $33,750 / 12 = $2,813/month net income."},
      {q:"Which of these is a FIXED expense?",options:["Dining out","Monthly rent","Grocery shopping","Entertainment"],correct:1,explanation:"Fixed expenses stay the same each month — rent, loan payments, insurance premiums."},
      {q:"In zero-based budgeting, Income − Expenses − Savings equals:",options:["10% surplus","Your savings goal","$0","Your investment fund"],correct:2,explanation:"Zero-based budgeting means every dollar has a purpose: Income − Expenses − Savings = $0."},
    ]
  },
  {
    id:"q2",title:"Emergency Fund Dungeon",category:"saving",icon:"🛡️",
    difficulty:2,xpReward:200,goldReward:100,requiredLevel:1,
    description:"Learn why emergency funds are critical and calculate your 3-6 month safety net.",
    questions:[
      {q:"The recommended size for an emergency fund is:",options:["1 month of expenses","2–3 months","3–6 months","12 months"],correct:2,explanation:"Financial experts recommend 3–6 months of living expenses for adequate protection."},
      {q:"Best place to keep your emergency fund:",options:["Stock market","High-yield savings account","Under your mattress","Retirement account"],correct:1,explanation:"Emergency funds need to be liquid and safe — high-yield savings accounts are ideal."},
      {q:"Your monthly expenses are $3,000. What is your MINIMUM emergency fund goal?",options:["$3,000","$6,000","$9,000","$18,000"],correct:2,explanation:"$3,000 × 3 months = $9,000 minimum. Up to $18,000 (6 months) is recommended."},
    ]
  },
  {
    id:"q3",title:"Credit Card Challenge",category:"credit",icon:"💳",
    difficulty:2,xpReward:250,goldReward:150,requiredLevel:2,
    description:"Master credit cards as a tool — APR, utilization, grace periods, and rewards.",
    questions:[
      {q:"$5,000 credit limit, $1,500 balance. What is your credit utilization?",options:["15%","30%","33%","50%"],correct:1,explanation:"$1,500 / $5,000 = 30% utilization. Keep it below 30% to protect your credit score."},
      {q:"20% APR on $1,000 balance for 1 year. Approximate interest paid:",options:["$20","$100","$200","$400"],correct:2,explanation:"$1,000 × 20% = $200 in interest per year (simplified — actual compounds monthly)."},
      {q:"The BEST way to use a credit card:",options:["Pay minimum each month","Pay full balance monthly","Keep balance at 90% of limit","Only use for emergencies"],correct:1,explanation:"Paying the full balance monthly avoids interest entirely while building credit history."},
    ]
  },
  {
    id:"q4",title:"Debt Destroyer",category:"debt",icon:"⚔️",
    difficulty:3,xpReward:400,goldReward:250,requiredLevel:3,
    description:"Snowball vs Avalanche — understand the math and psychology of debt payoff.",
    questions:[
      {q:"Debt Avalanche targets debts in what order?",options:["Smallest balance first","Highest interest rate first","Oldest debt first","Largest balance first"],correct:1,explanation:"Avalanche targets highest-interest debt first — mathematically optimal."},
      {q:"Debt Snowball prioritizes:",options:["Highest interest rate debts","Largest balances","Smallest balances for quick wins","Most recent debts"],correct:2,explanation:"Snowball pays off smallest balances first, providing psychological wins and momentum."},
      {q:"$500 extra/month. CC $3K@22%, Auto $12K@6%, Student $30K@5%. Avalanche first targets:",options:["Student loan","Auto loan","Credit card","Split equally"],correct:2,explanation:"Avalanche: Credit card at 22% APR is the most expensive debt — pay it first."},
    ]
  },
  {
    id:"q5",title:"Investment Initiation",category:"investing",icon:"📈",
    difficulty:3,xpReward:500,goldReward:300,requiredLevel:5,
    description:"Overcome investment fear — compound interest, index funds, and market cycles.",
    questions:[
      {q:"Rule of 72: How long to double money at 8% annual return?",options:["6 years","9 years","12 years","18 years"],correct:1,explanation:"Rule of 72: 72 / 8 = 9 years to double your money at 8% annual return."},
      {q:"An S&P 500 index fund provides:",options:["Guaranteed 10% returns","Diversified ownership of ~500 large US companies","Protection from all downturns","Always beats actively managed funds"],correct:1,explanation:"S&P 500 index funds give you diversified exposure to 500 large US companies at very low cost."},
      {q:"The stock market drops 25%. Best long-term strategy:",options:["Sell everything immediately","Wait for recovery before investing","Stay invested and consider buying more","Move all money to cash"],correct:2,explanation:"Market downturns are opportunities. Time IN the market beats timing the market. Stay invested."},
    ]
  },
  {
    id:"q6",title:"The 401(k) Decision",category:"retirement",icon:"🏦",
    difficulty:4,xpReward:600,goldReward:400,requiredLevel:8,
    description:"Maximize employer matches and choose Traditional vs Roth for long-term impact.",
    questions:[
      {q:"Employer matches 100% up to 3% of contributions. Salary $60,000. Minimum to get full match:",options:["$600/year","$1,200/year","$1,800/year","$3,600/year"],correct:2,explanation:"$60,000 × 3% = $1,800/year. This earns you $1,800 in free employer match money!"},
      {q:"Roth 401(k) is BEST when you expect your tax rate to be:",options:["Lower in retirement","Higher in retirement","It doesn't matter","Zero in retirement"],correct:1,explanation:"Roth contributions are post-tax. If rates are higher later, paying taxes now at a lower rate wins."},
      {q:"$500/month, 8% return, 30 years. Approximate final value:",options:["$180,000","$450,000","$680,000","$1,100,000"],correct:2,explanation:"Compound growth: $500/mo × 30 years at 8% ≈ $680,000. Start early — time is the most powerful variable!"},
    ]
  },
  {
    id:"q7",title:"Tax Optimization Tower",category:"taxes",icon:"🗼",
    difficulty:4,xpReward:550,goldReward:350,requiredLevel:10,
    description:"Progressive brackets, deductions vs credits, and HSA triple tax advantage.",
    questions:[
      {q:"You're in the 22% bracket. That means 22% applies to:",options:["All your income","Only dollars above the 12% bracket ceiling","A secret flat amount","Your gross salary only"],correct:1,explanation:"Progressive taxation: only dollars above each threshold are taxed at the higher rate. Your effective rate is much lower than 22%."},
      {q:"$1,000 tax CREDIT vs $1,000 tax DEDUCTION (22% bracket). Which saves more?",options:["Deduction — reduces income","Credit — reduces tax directly","They save the same","Depends on filing status"],correct:1,explanation:"Credits reduce tax dollar-for-dollar ($1,000 saved). Deductions reduce taxable income ($220 saved at 22%)."},
      {q:"HSA (Health Savings Account) offers:",options:["Tax-free contributions only","Tax-free growth only","Tax-free withdrawals for medical only","All three: deductible contributions, tax-free growth, tax-free medical withdrawals"],correct:3,explanation:"HSAs have a triple tax advantage — often called a 'stealth IRA.' One of the best tax-advantaged vehicles available."},
    ]
  },
  {
    id:"q8",title:"Mortgage Mansion",category:"real_estate",icon:"🏡",
    difficulty:5,xpReward:800,goldReward:600,requiredLevel:15,
    description:"Rent vs buy, mortgage mechanics, down payments, PMI and total ownership costs.",
    questions:[
      {q:"Buying a $300,000 home. Traditional down payment to avoid PMI:",options:["3.5% ($10,500)","10% ($30,000)","20% ($60,000)","25% ($75,000)"],correct:2,explanation:"20% down ($60,000) avoids Private Mortgage Insurance (PMI), which adds 0.5–1% annually to your cost."},
      {q:"30-year vs 15-year mortgage on the same amount. 30-year has:",options:["Lower monthly payment, more total interest","Higher monthly payment, more total interest","Lower monthly payment, less total interest","Same total interest, different timing"],correct:0,explanation:"30-year = lower monthly payment but you pay roughly 2× the home price in total. 15-year costs less overall."},
      {q:"Break-even point for buying vs renting is typically:",options:["1–2 years","3–4 years","5–7 years","10+ years"],correct:2,explanation:"After accounting for closing costs, down payment, and transaction costs, buying typically breaks even in 5–7 years."},
    ]
  },
  {
    id:"q9",title:"Insurance Fundamentals",category:"insurance",icon:"🛡️",
    difficulty:3,xpReward:350,goldReward:200,requiredLevel:6,
    description:"Life insurance types, disability insurance, health plan trade-offs and coverage needs.",
    questions:[
      {q:"Term life insurance vs whole life insurance — which is generally recommended?",options:["Whole life — has cash value","Term life — lower cost, pure protection","They're equivalent","Depends on income"],correct:1,explanation:"'Buy term, invest the difference' — term is much cheaper and provides pure death benefit protection."},
      {q:"Health insurance: a high-deductible plan with HSA is best for:",options:["Someone expecting high medical costs","A healthy person with low expected costs","Everyone equally","People over 65"],correct:1,explanation:"High-deductible plans have lower premiums and are HSA-eligible — ideal for healthy individuals who rarely need care."},
      {q:"Disability insurance typically replaces what percentage of your income?",options:["25–40%","60–70%","90–100%","It varies by employer only"],correct:1,explanation:"Disability insurance typically replaces 60–70% of income if you're unable to work due to illness or injury."},
    ]
  },
  {
    id:"q10",title:"Budgeting Mastery",category:"budgeting",icon:"📊",
    difficulty:2,xpReward:300,goldReward:175,requiredLevel:3,
    description:"50/30/20 rule, zero-based budgeting, sinking funds and variable income strategies.",
    questions:[
      {q:"The 50/30/20 rule allocates income as:",options:["50% savings, 30% needs, 20% wants","50% needs, 30% wants, 20% savings/debt","50% wants, 30% savings, 20% needs","50% rent, 30% food, 20% fun"],correct:1,explanation:"50% Needs (essentials), 30% Wants (discretionary), 20% Savings/Debt repayment — a simple beginner framework."},
      {q:"'Pay yourself first' means:",options:["Spend fun money first","Automate savings before anything else","Pay your highest bill first","Pay off debt before living"],correct:1,explanation:"Automate savings transfer on payday — you live on what remains. You can't spend what you don't see."},
      {q:"Sinking funds are used for:",options:["Emergency expenses","Irregular but predictable expenses (car insurance, gifts)","High-interest debt","Daily groceries"],correct:1,explanation:"Sinking funds save monthly for known future expenses — divide the annual cost by 12 and set it aside each month."},
    ]
  },
  {
    id:"q11",title:"Credit Score Quest",category:"credit",icon:"⭐",
    difficulty:3,xpReward:400,goldReward:250,requiredLevel:4,
    description:"FICO model components: payment history, utilization, length, mix, and inquiries.",
    questions:[
      {q:"Largest factor in your credit score (FICO):",options:["Credit utilization 30%","Payment history 35%","Length of credit history 15%","Credit mix 10%"],correct:1,explanation:"Payment history (35%) is the single biggest factor — on-time payments are the most important credit behavior."},
      {q:"A 'hard inquiry' on your credit report:",options:["Has no effect","Temporarily lowers your score","Permanently damages your credit","Is caused by checking your own score"],correct:1,explanation:"Hard inquiries from credit applications cause a small temporary dip — recovers in 6–12 months. Soft pulls (checking your own score) don't affect it."},
      {q:"To build credit with no credit history, the best first step is:",options:["Take a large personal loan","Get a secured credit card","Open 5 accounts at once","Become an authorized user on a parent's card"],correct:3,explanation:"Becoming an authorized user on a responsible person's card is low-risk and immediately adds their history to your report."},
    ]
  },
  {
    id:"q12",title:"Financial Independence Quest",category:"investing",icon:"🔥",
    difficulty:5,xpReward:1000,goldReward:750,requiredLevel:20,
    description:"Calculate your FI number, understand the 4% rule, and plan your FIRE journey.",
    questions:[
      {q:"The Financial Independence 'FI number' formula is:",options:["Annual income × 10","Annual expenses × 25","Monthly expenses × 100","Net worth ÷ 0.04"],correct:1,explanation:"FI Number = Annual Expenses × 25 (the inverse of the 4% safe withdrawal rate)."},
      {q:"The 4% safe withdrawal rule means:",options:["You can spend 4% of income in retirement","Withdraw 4% of portfolio annually — historically sustainable for 30+ years","Invest at least 4% of salary","Pay 4% in taxes on gains"],correct:1,explanation:"Withdrawing 4% annually has a 95%+ success rate over 30 years of historical data. It's the cornerstone of FIRE planning."},
      {q:"You need $60,000/year in retirement. Required portfolio size using 4% rule:",options:["$600,000","$1,000,000","$1,500,000","$2,400,000"],correct:2,explanation:"$60,000 / 0.04 = $1,500,000 required portfolio. When you reach this number, you're theoretically financially independent!"},
    ]
  },
];

const ACHIEVEMENTS = [
  {id:"first_steps",name:"First Steps",icon:"👣",desc:"Complete your first quest",rarity:"common"},
  {id:"emergency_ready",name:"Emergency Ready",icon:"🛡️",desc:"Complete Emergency Fund quest",rarity:"rare"},
  {id:"credit_master",name:"Credit Master",icon:"💳",desc:"Complete Credit Card quest",rarity:"rare"},
  {id:"debt_destroyer",name:"Debt Destroyer",icon:"⚔️",desc:"Complete Debt Destroyer quest",rarity:"epic"},
  {id:"first_investor",name:"First Investor",icon:"📈",desc:"Complete Investment quest",rarity:"rare"},
  {id:"perfect_score",name:"Perfect Score",icon:"⭐",desc:"Answer all questions correctly in a quest",rarity:"epic"},
  {id:"level_5",name:"Rising Star",icon:"🌟",desc:"Reach Level 5",rarity:"rare"},
  {id:"level_10",name:"Financial Scholar",icon:"🎓",desc:"Reach Level 10",rarity:"epic"},
  {id:"level_20",name:"Wealth Builder",icon:"💎",desc:"Reach Level 20",rarity:"legendary"},
  {id:"wealth_1k",name:"First Thousand",icon:"💰",desc:"Accumulate 1,000 Gold",rarity:"common"},
  {id:"wealth_5k",name:"Gold Hoarder",icon:"🏅",desc:"Accumulate 5,000 Gold",rarity:"rare"},
  {id:"tax_savvy",name:"Tax Savvy",icon:"🗼",desc:"Complete Tax Optimization quest",rarity:"rare"},
  {id:"homeowner",name:"Homeowner",icon:"🏡",desc:"Complete Mortgage Mansion quest",rarity:"epic"},
  {id:"speed_learner",name:"Speed Learner",icon:"⚡",desc:"Complete a quest in under 60 seconds",rarity:"rare"},
  {id:"streak_7",name:"Week Warrior",icon:"🔥",desc:"Maintain a 7-day streak",rarity:"rare"},
  {id:"quest_master",name:"Quest Master",icon:"📋",desc:"Complete 6 quests",rarity:"epic"},
  {id:"fi_ready",name:"FI Ready",icon:"🔥",desc:"Complete Financial Independence quest",rarity:"legendary"},
  {id:"insurance_pro",name:"Insurance Pro",icon:"🛡️",desc:"Complete Insurance Fundamentals",rarity:"common"},
  {id:"budget_guru",name:"Budget Guru",icon:"📊",desc:"Complete Budgeting Mastery quest",rarity:"common"},
  {id:"credit_analyst",name:"Credit Analyst",icon:"⭐",desc:"Complete Credit Score Quest",rarity:"rare"},
];

const MINI_GAMES = [
  {id:"compound_calc",name:"Interest Rate Roulette",icon:"🎰",desc:"Visualize compound interest magic — adjust rate, time, principal",category:"calculation"},
  {id:"budget_balancer",name:"Budget Balancer",icon:"⚖️",desc:"Balance income vs expenses to zero using sliders",category:"budgeting"},
  {id:"debt_payoff",name:"Debt Snowball vs Avalanche",icon:"☃️",desc:"Compare debt payoff strategies side by side",category:"debt"},
  {id:"stock_simulator",name:"Stock Market Survivor",icon:"📊",desc:"Survive 10 years of market volatility with discipline",category:"investing"},
  {id:"tax_bracket",name:"Tax Bracket Visualizer",icon:"🗼",desc:"See exactly how progressive taxation works",category:"taxes"},
  {id:"fi_calculator",name:"FI Number Calculator",icon:"🔥",desc:"Calculate your path to financial independence",category:"investing"},
];

const SKILL_TREE = {
  earning: {
    label:"Earning Branch", color:"#f59e0b", icon:"💼",
    desc:"Income optimization and career growth",
    skills:[
      {id:"salary1",name:"Salary Negotiation I",effect:"+5% income",cost:1,requires:null},
      {id:"hustle",name:"Side Hustle",effect:"Unlock freelance quests",cost:1,requires:null},
      {id:"salary2",name:"Salary Negotiation II",effect:"+10% income",cost:2,requires:"salary1"},
      {id:"entrepreneur",name:"Entrepreneurship",effect:"Business income stream",cost:3,requires:"hustle"},
    ]
  },
  saving: {
    label:"Saving Branch", color:"#10b981", icon:"🏦",
    desc:"Efficiency, discipline and tax optimization",
    skills:[
      {id:"frugal1",name:"Frugality I",effect:"-5% expenses",cost:1,requires:null},
      {id:"budget_tools",name:"Budget Tools",effect:"Enhanced analytics",cost:1,requires:null},
      {id:"frugal2",name:"Frugality II",effect:"-10% expenses",cost:2,requires:"frugal1"},
      {id:"tax_eff",name:"Tax Efficiency",effect:"Additional deductions",cost:3,requires:"budget_tools"},
    ]
  },
  investing: {
    label:"Investing Branch", color:"#3b82f6", icon:"📈",
    desc:"Returns, portfolio strategy and wealth building",
    skills:[
      {id:"market1",name:"Market Knowledge I",effect:"Basic investing",cost:1,requires:null},
      {id:"risk1",name:"Risk Management I",effect:"Optimal allocation",cost:1,requires:null},
      {id:"market2",name:"Market Knowledge II",effect:"Advanced strategies",cost:2,requires:"market1"},
      {id:"compound",name:"Compound Mastery",effect:"+5% investment returns",cost:3,requires:"risk1"},
    ]
  },
};

const rarityColors = {
  common:{bg:"#e8f5e9",text:"#2e7d32",border:"#4caf50"},
  rare:{bg:"#e3f2fd",text:"#1565c0",border:"#2196f3"},
  epic:{bg:"#f3e5f5",text:"#6a1b9a",border:"#9c27b0"},
  legendary:{bg:"#fff8e1",text:"#e65100",border:"#ff9800"},
};

const categoryColors = {
  tutorial:"#6366f1",saving:"#10b981",credit:"#f59e0b",debt:"#ef4444",
  investing:"#3b82f6",retirement:"#8b5cf6",taxes:"#059669",
  real_estate:"#dc2626",insurance:"#0891b2",budgeting:"#16a34a",
};

function xpToNextLevel(level){ return 100*(level+1); }

const INITIAL_STATE = {
  level:1,xp:0,gold:0,streak:7,skillPoints:3,
  unlockedSkills:[],
  completedQuests:[],achievements:[],
  financialStats:{creditScore:620,netWorth:0,debtLevel:45000,emergencyFund:0,savingsRate:0},
  weeklyProgress:{quests:0,gold:0,achievements:0},
};

// ─── CHARACTER CREATION ───────────────────────────────────────────────────────
function CharacterCreation({onStart}){
  const [name,setName]=useState("");
  const [difficulty,setDifficulty]=useState("normal");
  const [step,setStep]=useState(0);
  const difficulties=[
    {id:"tutorial",label:"Apprentice",desc:"Hints provided, extra guidance. Perfect for beginners.",icon:"🌱"},
    {id:"normal",label:"Adventurer",desc:"Realistic rules with some guidance.",icon:"⚔️"},
    {id:"hard",label:"Expert",desc:"Complex scenarios, minimal guidance.",icon:"🔥"},
    {id:"ironman",label:"Iron Man",desc:"Permadeath mode — no second chances. Hardcore players only.",icon:"💀"},
  ];
  return(
    <div style={{minHeight:"100vh",background:`radial-gradient(ellipse at top left, #1e1b4b 0%, #0f0c29 40%, #080b14 100%)`,display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem",fontFamily:"'Georgia', serif",position:"relative",overflow:"hidden"}}>
      {/* stars */}
      {[...Array(30)].map((_,i)=>(
        <div key={i} style={{position:"absolute",width:i%5===0?3:2,height:i%5===0?3:2,borderRadius:"50%",background:"#fff",opacity:Math.random()*0.6+0.2,top:`${Math.random()*100}%`,left:`${Math.random()*100}%`,animation:`twinkle ${2+Math.random()*3}s infinite`,}}/>
      ))}
      <style>{`@keyframes twinkle{0%,100%{opacity:.2}50%{opacity:.9}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}@keyframes glow{0%,100%{text-shadow:0 0 20px rgba(245,200,66,.4)}50%{text-shadow:0 0 40px rgba(245,200,66,.8)}}`}</style>
      <div style={{maxWidth:560,width:"100%",textAlign:"center",position:"relative",zIndex:1}}>
        <div style={{fontSize:80,marginBottom:8,animation:"float 3s ease-in-out infinite"}}>🏰</div>
        <h1 style={{color:"#f5c842",fontSize:38,fontWeight:"bold",marginBottom:4,animation:"glow 2s ease-in-out infinite",letterSpacing:1}}>
          Financial Literacy RPG
        </h1>
        <p style={{color:"#a78bfa",fontSize:15,marginBottom:8,letterSpacing:3,textTransform:"uppercase"}}>Quest for Financial Freedom</p>
        <div style={{background:"rgba(99,102,241,.1)",border:"1px solid rgba(99,102,241,.2)",borderRadius:12,padding:"10px 20px",marginBottom:32,display:"inline-block"}}>
          <span style={{color:"#94a3b8",fontSize:13}}>🔒 Private & Confidential · ZeTheta Algorithms Pvt. Ltd.</span>
        </div>

        {step===0&&(
          <div style={{animation:"fadeIn .4s"}}>
            <div style={{background:"rgba(255,255,255,.05)",borderRadius:16,padding:"2rem",border:"1px solid rgba(255,255,255,.1)",marginBottom:20}}>
              <label style={{color:"#c4b5fd",fontSize:12,display:"block",marginBottom:12,textAlign:"left",letterSpacing:2,textTransform:"uppercase"}}>Your Hero's Name</label>
              <input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&name.trim()&&setStep(1)} placeholder="Enter your name..." style={{width:"100%",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.2)",borderRadius:10,padding:"13px 16px",color:"#fff",fontSize:18,boxSizing:"border-box",outline:"none",fontFamily:"inherit"}}/>
            </div>
            <button onClick={()=>name.trim()&&setStep(1)} disabled={!name.trim()} style={{background:name.trim()?"linear-gradient(135deg,#6366f1,#8b5cf6)":"rgba(255,255,255,.1)",color:"#fff",border:"none",borderRadius:12,padding:"14px 40px",fontSize:17,cursor:name.trim()?"pointer":"not-allowed",width:"100%",fontWeight:"bold",letterSpacing:.5}}>
              Continue →
            </button>
          </div>
        )}

        {step===1&&(
          <div>
            <h2 style={{color:"#f5c842",fontSize:22,marginBottom:20}}>Choose Your Difficulty</h2>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
              {difficulties.map(d=>(
                <button key={d.id} onClick={()=>setDifficulty(d.id)} style={{background:difficulty===d.id?"rgba(99,102,241,.35)":"rgba(255,255,255,.04)",border:`2px solid ${difficulty===d.id?"#6366f1":"rgba(255,255,255,.1)"}`,borderRadius:12,padding:"14px 18px",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:14,textAlign:"left",transition:"all .2s"}}>
                  <span style={{fontSize:30}}>{d.icon}</span>
                  <div>
                    <div style={{fontWeight:"bold",fontSize:15}}>{d.label}</div>
                    <div style={{color:"#94a3b8",fontSize:13}}>{d.desc}</div>
                  </div>
                  {difficulty===d.id&&<span style={{marginLeft:"auto",color:"#a78bfa",fontSize:18}}>✓</span>}
                </button>
              ))}
            </div>
            <button onClick={()=>onStart({name:name.trim(),difficulty})} style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:12,padding:"14px",fontSize:17,cursor:"pointer",width:"100%",fontWeight:"bold",letterSpacing:.5}}>
              Begin Your Quest! ⚔️
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── QUEST SCREEN ─────────────────────────────────────────────────────────────
function QuestScreen({quest,onComplete,onBack,difficulty}){
  const [currentQ,setCurrentQ]=useState(0);
  const [selected,setSelected]=useState(null);
  const [answered,setAnswered]=useState(false);
  const [answers,setAnswers]=useState([]);
  const [startTime]=useState(Date.now());
  const [showResult,setShowResult]=useState(false);
  const q=quest.questions[currentQ];
  const totalQ=quest.questions.length;
  function handleAnswer(idx){if(answered)return;setSelected(idx);setAnswered(true);setAnswers(p=>[...p,{correct:idx===q.correct}]);}
  function handleNext(){if(currentQ<totalQ-1){setCurrentQ(c=>c+1);setSelected(null);setAnswered(false);}else{setShowResult(true);}}
  if(showResult){
    const correct=answers.filter(a=>a.correct).length;
    const score=Math.round((correct/totalQ)*100);
    const timeTaken=Math.round((Date.now()-startTime)/1000);
    const xpEarned=Math.round(quest.xpReward*(score/100));
    const goldEarned=Math.round(quest.goldReward*(score/100));
    return(
      <div style={{minHeight:"100vh",background:"#080b14",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem",fontFamily:"'Georgia',serif"}}>
        <div style={{maxWidth:500,width:"100%",textAlign:"center"}}>
          <div style={{fontSize:70,marginBottom:12}}>{score>=80?"🏆":score>=60?"🥈":"📚"}</div>
          <h2 style={{color:"#f5c842",fontSize:28,marginBottom:4}}>Quest Complete!</h2>
          <p style={{color:"#64748b",marginBottom:28}}>{quest.title}</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:28}}>
            {[{label:"Score",value:`${score}%`},{label:"XP Earned",value:`+${xpEarned}`},{label:"Gold Earned",value:`+${goldEarned}`}].map(s=>(
              <div key={s.label} style={{background:"rgba(255,255,255,.06)",borderRadius:12,padding:"14px 8px",border:"1px solid rgba(255,255,255,.09)"}}>
                <div style={{color:"#64748b",fontSize:11,marginBottom:3}}>{s.label}</div>
                <div style={{color:"#f5c842",fontSize:22,fontWeight:"bold"}}>{s.value}</div>
              </div>
            ))}
          </div>
          <div style={{background:"rgba(255,255,255,.04)",borderRadius:12,padding:"1.25rem",marginBottom:20,textAlign:"left"}}>
            {quest.questions.map((qq,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:12}}>
                <span style={{fontSize:15,flexShrink:0}}>{answers[i]?.correct?"✅":"❌"}</span>
                <div>
                  <div style={{color:"#e2e8f0",fontSize:13,marginBottom:2}}>{qq.q}</div>
                  <div style={{color:"#64748b",fontSize:12}}>{qq.explanation}</div>
                </div>
              </div>
            ))}
          </div>
          {timeTaken<60&&<div style={{background:"rgba(245,200,66,.1)",border:"1px solid rgba(245,200,66,.3)",borderRadius:10,padding:"10px",marginBottom:16,color:"#f5c842",fontSize:13}}>⚡ Speed Bonus! Completed in {timeTaken}s</div>}
          <button onClick={()=>onComplete({xp:xpEarned,gold:goldEarned,score,questId:quest.id,timeTaken})} style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:12,padding:"14px",fontSize:17,cursor:"pointer",width:"100%",fontWeight:"bold"}}>
            Claim Rewards! ✨
          </button>
        </div>
      </div>
    );
  }
  return(
    <div style={{minHeight:"100vh",background:"#080b14",fontFamily:"'Georgia',serif",padding:"1.5rem"}}>
      <div style={{maxWidth:620,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:22}}>
          <button onClick={onBack} style={{background:"rgba(255,255,255,.08)",border:"none",color:"#94a3b8",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:14}}>← Back</button>
          <div style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{color:"#94a3b8",fontSize:13}}>{quest.title}</span>
              <span style={{color:"#94a3b8",fontSize:13}}>Q {currentQ+1}/{totalQ}</span>
            </div>
            <div style={{background:"rgba(255,255,255,.08)",borderRadius:4,height:6}}>
              <div style={{background:"#6366f1",borderRadius:4,height:"100%",width:`${(currentQ/totalQ)*100}%`,transition:"width .3s"}}/>
            </div>
          </div>
        </div>
        <div style={{background:"rgba(99,102,241,.08)",borderRadius:16,padding:"2rem",border:"1px solid rgba(99,102,241,.2)",marginBottom:18}}>
          <div style={{fontSize:36,marginBottom:14}}>{quest.icon}</div>
          <p style={{color:"#e2e8f0",fontSize:18,lineHeight:1.7,margin:0}}>{q.q}</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {q.options.map((opt,i)=>{
            let bg="rgba(255,255,255,.04)",border="rgba(255,255,255,.1)",color="#e2e8f0";
            if(answered){
              if(i===q.correct){bg="rgba(16,185,129,.2)";border="#10b981";}
              else if(i===selected&&i!==q.correct){bg="rgba(239,68,68,.2)";border="#ef4444";}
            }
            return(
              <button key={i} onClick={()=>handleAnswer(i)} style={{background:bg,border:`1px solid ${border}`,borderRadius:12,padding:"14px 18px",color,fontSize:15,cursor:answered?"default":"pointer",textAlign:"left",transition:"all .15s",display:"flex",alignItems:"center",gap:12}}>
                <span style={{background:"rgba(255,255,255,.08)",borderRadius:6,padding:"2px 9px",fontSize:12,flexShrink:0}}>{["A","B","C","D"][i]}</span>
                {opt}
              </button>
            );
          })}
        </div>
        {answered&&(
          <div style={{marginTop:18}}>
            <div style={{background:selected===q.correct?"rgba(16,185,129,.12)":"rgba(239,68,68,.12)",border:`1px solid ${selected===q.correct?"#10b981":"#ef4444"}`,borderRadius:12,padding:"1rem 1.25rem",marginBottom:14}}>
              <div style={{color:selected===q.correct?"#10b981":"#ef4444",fontWeight:"bold",marginBottom:4}}>{selected===q.correct?"✓ Correct!":"✗ Not quite..."}</div>
              <p style={{color:"#94a3b8",margin:0,fontSize:14}}>{q.explanation}</p>
            </div>
            <button onClick={handleNext} style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:12,padding:"13px",fontSize:15,cursor:"pointer",width:"100%",fontWeight:"bold"}}>
              {currentQ<totalQ-1?"Next Question →":"Complete Quest 🏆"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MINI GAMES ──────────────────────────────────────────────────────────────
function CompoundInterestGame({onClose}){
  const [principal,setPrincipal]=useState(5000);
  const [rate,setRate]=useState(8);
  const [years,setYears]=useState(30);
  const [monthly,setMonthly]=useState(200);
  const finalAmount=principal*Math.pow(1+rate/100,years)+monthly*12*((Math.pow(1+rate/100,years)-1)/(rate/100));
  const totalContrib=principal+monthly*12*years;
  const totalGrowth=finalAmount-totalContrib;
  return(
    <div style={{padding:"1.5rem",color:"#e2e8f0",fontFamily:"Georgia,serif"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <h2 style={{color:"#f5c842",margin:0}}>🎰 Interest Rate Roulette</h2>
        <button onClick={onClose} style={{background:"rgba(255,255,255,.08)",border:"none",color:"#94a3b8",borderRadius:8,padding:"8px 14px",cursor:"pointer"}}>Close</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:22}}>
        {[
          {label:"Starting Amount",value:`$${principal.toLocaleString()}`,key:"principal",min:1000,max:50000,step:500,val:principal,set:setPrincipal},
          {label:"Annual Return (%)",value:`${rate}%`,key:"rate",min:1,max:15,step:.5,val:rate,set:setRate},
          {label:"Years",value:`${years} yrs`,key:"years",min:5,max:40,step:1,val:years,set:setYears},
          {label:"Monthly Contribution",value:`$${monthly}/mo`,key:"monthly",min:0,max:2000,step:50,val:monthly,set:setMonthly},
        ].map(c=>(
          <div key={c.key} style={{background:"rgba(255,255,255,.04)",borderRadius:12,padding:"1rem"}}>
            <div style={{color:"#64748b",fontSize:12,marginBottom:4}}>{c.label}</div>
            <div style={{color:"#f5c842",fontSize:20,fontWeight:"bold",marginBottom:8}}>{c.value}</div>
            <input type="range" min={c.min} max={c.max} step={c.step} value={c.val} onChange={e=>c.set(Number(e.target.value))} style={{width:"100%",accentColor:"#6366f1"}}/>
          </div>
        ))}
      </div>
      <div style={{background:"rgba(99,102,241,.12)",borderRadius:16,padding:"1.5rem",border:"1px solid rgba(99,102,241,.25)",marginBottom:14}}>
        <div style={{textAlign:"center"}}>
          <div style={{color:"#94a3b8",fontSize:13,marginBottom:4}}>Final Portfolio Value</div>
          <div style={{color:"#f5c842",fontSize:40,fontWeight:"bold"}}>${Math.round(finalAmount).toLocaleString()}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:16}}>
          <div style={{textAlign:"center"}}>
            <div style={{color:"#94a3b8",fontSize:12}}>Total Contributed</div>
            <div style={{color:"#60a5fa",fontSize:20,fontWeight:"bold"}}>${Math.round(totalContrib).toLocaleString()}</div>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{color:"#94a3b8",fontSize:12}}>Investment Growth</div>
            <div style={{color:"#10b981",fontSize:20,fontWeight:"bold"}}>${Math.round(totalGrowth).toLocaleString()}</div>
          </div>
        </div>
      </div>
      <div style={{background:"rgba(16,185,129,.08)",borderRadius:12,padding:"1rem",border:"1px solid rgba(16,185,129,.2)"}}>
        <p style={{margin:0,color:"#6ee7b7",fontSize:14}}>💡 Rule of 72: At {rate}% return, your money doubles every <strong>{Math.round(72/rate)} years</strong>. Starting 10 years earlier would add ~<strong>${Math.round(finalAmount*.55).toLocaleString()}</strong> more!</p>
      </div>
    </div>
  );
}

function BudgetBalancerGame({onClose}){
  const income=3500;
  const [housing,setHousing]=useState(1100);
  const [food,setFood]=useState(400);
  const [transport,setTransport]=useState(350);
  const [savings,setSavings]=useState(500);
  const [entertainment,setEntertainment]=useState(200);
  const total=housing+food+transport+savings+entertainment;
  const remaining=income-total;
  const balanced=Math.abs(remaining)<50;
  return(
    <div style={{padding:"1.5rem",color:"#e2e8f0",fontFamily:"Georgia,serif"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <h2 style={{color:"#f5c842",margin:0}}>⚖️ Budget Balancer</h2>
        <button onClick={onClose} style={{background:"rgba(255,255,255,.08)",border:"none",color:"#94a3b8",borderRadius:8,padding:"8px 14px",cursor:"pointer"}}>Close</button>
      </div>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{color:"#94a3b8",fontSize:13}}>Monthly Income</div>
        <div style={{color:"#f5c842",fontSize:32,fontWeight:"bold"}}>${income.toLocaleString()}</div>
        <div style={{color:remaining>=0?"#10b981":"#ef4444",fontSize:18,fontWeight:"bold"}}>{remaining>=0?`$${remaining} remaining`:`$${Math.abs(remaining)} over budget!`}</div>
        <div style={{background:"rgba(255,255,255,.08)",borderRadius:4,height:8,marginTop:8}}>
          <div style={{background:remaining>=0?"#10b981":"#ef4444",borderRadius:4,height:"100%",width:`${Math.min(100,(total/income)*100)}%`,transition:"width .3s"}}/>
        </div>
      </div>
      {[{label:"🏠 Housing",value:housing,set:setHousing,max:2000,step:50,rec:"25-35%"},{label:"🍔 Food",value:food,set:setFood,max:800,step:25,rec:"10-15%"},{label:"🚗 Transport",value:transport,set:setTransport,max:800,step:25,rec:"15-20%"},{label:"💰 Savings",value:savings,set:setSavings,max:1000,step:50,rec:"15-20%"},{label:"🎮 Entertainment",value:entertainment,set:setEntertainment,max:600,step:25,rec:"5-10%"}].map(item=>(
        <div key={item.label} style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{fontSize:13}}>{item.label}</span>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{color:"#64748b",fontSize:11}}>Rec: {item.rec}</span>
              <span style={{color:"#f5c842",fontWeight:"bold",minWidth:70,textAlign:"right"}}>${item.value}/mo</span>
            </div>
          </div>
          <input type="range" min={0} max={item.max} step={item.step} value={item.value} onChange={e=>item.set(Number(e.target.value))} style={{width:"100%",accentColor:"#6366f1"}}/>
        </div>
      ))}
      {balanced&&<div style={{background:"rgba(16,185,129,.12)",borderRadius:12,padding:"1rem",border:"1px solid #10b981",textAlign:"center"}}>
        <div style={{fontSize:22,marginBottom:4}}>🎉</div>
        <p style={{margin:0,color:"#6ee7b7",fontWeight:"bold"}}>Budget balanced! Saving rate: {Math.round((savings/income)*100)}%</p>
      </div>}
    </div>
  );
}

function DebtPayoffGame({onClose}){
  const [strategy,setStrategy]=useState("snowball");
  const debts=[{name:"Credit Card",balance:3000,apr:22,color:"#ef4444"},{name:"Auto Loan",balance:12000,apr:6,color:"#f59e0b"},{name:"Student Loan",balance:30000,apr:5,color:"#6366f1"}];
  const snowOrder=[...debts].sort((a,b)=>a.balance-b.balance);
  const avaOrder=[...debts].sort((a,b)=>b.apr-a.apr);
  return(
    <div style={{padding:"1.5rem",color:"#e2e8f0",fontFamily:"Georgia,serif"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{color:"#f5c842",margin:0}}>☃️ Debt Payoff Strategies</h2>
        <button onClick={onClose} style={{background:"rgba(255,255,255,.08)",border:"none",color:"#94a3b8",borderRadius:8,padding:"8px 14px",cursor:"pointer"}}>Close</button>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {["snowball","avalanche"].map(s=>(
          <button key={s} onClick={()=>setStrategy(s)} style={{flex:1,background:strategy===s?(s==="snowball"?"rgba(99,102,241,.25)":"rgba(239,68,68,.25)"):"rgba(255,255,255,.04)",border:`1px solid ${strategy===s?(s==="snowball"?"#6366f1":"#ef4444"):"rgba(255,255,255,.1)"}`,borderRadius:10,padding:"10px",color:"#fff",cursor:"pointer",fontSize:14,fontWeight:strategy===s?"bold":"normal"}}>
            {s==="snowball"?"❄️ Snowball":"🔥 Avalanche"}
          </button>
        ))}
      </div>
      <div style={{background:"rgba(255,255,255,.04)",borderRadius:12,padding:"1rem",marginBottom:14}}>
        <div style={{color:"#64748b",fontSize:13,marginBottom:12}}>{strategy==="snowball"?"Pay smallest balance first → psychological wins & momentum":"Pay highest interest rate first → mathematically saves more money"}</div>
        {(strategy==="snowball"?snowOrder:avaOrder).map((d,i)=>(
          <div key={d.name} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<2?"1px solid rgba(255,255,255,.07)":"none"}}>
            <div style={{background:d.color,borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:"bold",color:"#fff",flexShrink:0}}>{i+1}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:"bold"}}>{d.name}</div>
              <div style={{color:"#64748b",fontSize:13}}>${d.balance.toLocaleString()} @ {d.apr}% APR</div>
            </div>
            {i===0&&<span style={{background:"rgba(99,102,241,.2)",color:"#818cf8",fontSize:12,padding:"2px 8px",borderRadius:6}}>Attack!</span>}
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        <div style={{background:"rgba(99,102,241,.08)",borderRadius:12,padding:"1rem",textAlign:"center",border:"1px solid rgba(99,102,241,.2)"}}>
          <div style={{color:"#94a3b8",fontSize:12}}>Snowball Interest</div>
          <div style={{color:"#a78bfa",fontSize:22,fontWeight:"bold"}}>$11,500</div>
          <div style={{color:"#64748b",fontSize:12}}>28 months</div>
        </div>
        <div style={{background:"rgba(239,68,68,.08)",borderRadius:12,padding:"1rem",textAlign:"center",border:"1px solid rgba(239,68,68,.2)"}}>
          <div style={{color:"#94a3b8",fontSize:12}}>Avalanche Interest</div>
          <div style={{color:"#f87171",fontSize:22,fontWeight:"bold"}}>$10,200</div>
          <div style={{color:"#64748b",fontSize:12}}>26 months</div>
        </div>
      </div>
      <div style={{background:"rgba(16,185,129,.08)",borderRadius:12,padding:"1rem",border:"1px solid rgba(16,185,129,.2)"}}>
        <p style={{margin:0,color:"#6ee7b7",fontSize:13}}>💡 Avalanche saves <strong>$1,300</strong> and finishes 2 months sooner. Snowball's psychological wins help many people stay motivated. Choose what works for <em>you</em>.</p>
      </div>
    </div>
  );
}

function StockSimulatorGame({onClose}){
  const [portfolio,setPortfolio]=useState(10000);
  const [year,setYear]=useState(0);
  const [log,setLog]=useState([]);
  const events=[
    {return:.12,event:"Bull market! Tech sector surging.",type:"good"},
    {return:.08,event:"Steady growth. Economy expanding.",type:"good"},
    {return:-.15,event:"Recession! Market drops sharply.",type:"bad"},
    {return:.20,event:"Recovery! Markets bounce back strong.",type:"great"},
    {return:.05,event:"Slow year. Inflation concerns.",type:"neutral"},
    {return:.15,event:"Bull run! Record highs.",type:"good"},
    {return:-.08,event:"Correction! Markets pull back.",type:"bad"},
    {return:.10,event:"Recovery. Strong earnings season.",type:"good"},
    {return:.18,event:"Strong year! Everything up.",type:"great"},
    {return:.12,event:"Solid finish. Markets close strong.",type:"good"},
  ];
  function advance(choice){
    if(year>=events.length)return;
    const ev=events[year];
    let newP=portfolio,outcome="";
    if(choice==="stay"){newP=portfolio*(1+ev.return);outcome=`${ev.return>=0?"+":""}${Math.round(ev.return*100)}% → $${Math.round(newP).toLocaleString()}`;}
    else if(choice==="sell"){newP=0;outcome=`Sold all. Cash: $${Math.round(portfolio).toLocaleString()}`;}
    else{newP=(portfolio+1000)*(1+ev.return);outcome=`Bought +$1K. ${ev.return>=0?"+":""}${Math.round(ev.return*100)}% → $${Math.round(newP).toLocaleString()}`;}
    setPortfolio(newP);
    setLog(p=>[...p,{year:year+1,event:ev.event,type:ev.type,choice,outcome}]);
    setYear(y=>y+1);
  }
  const currentEvent=year<events.length?events[year]:null;
  const gain=portfolio-10000;
  return(
    <div style={{padding:"1.5rem",color:"#e2e8f0",fontFamily:"Georgia,serif"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <h2 style={{color:"#f5c842",margin:0}}>📊 Stock Market Survivor</h2>
        <button onClick={onClose} style={{background:"rgba(255,255,255,.08)",border:"none",color:"#94a3b8",borderRadius:8,padding:"8px 14px",cursor:"pointer"}}>Close</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:18}}>
        {[{label:"Year",value:`${year}/10`,color:"#f5c842"},{label:"Portfolio",value:`$${Math.round(portfolio).toLocaleString()}`,color:"#60a5fa"},{label:"Total Gain",value:`${gain>=0?"+":""}$${Math.abs(Math.round(gain)).toLocaleString()}`,color:gain>=0?"#10b981":"#ef4444"}].map(s=>(
          <div key={s.label} style={{background:"rgba(255,255,255,.05)",borderRadius:10,padding:"12px",textAlign:"center"}}>
            <div style={{color:"#64748b",fontSize:12}}>{s.label}</div>
            <div style={{color:s.color,fontSize:20,fontWeight:"bold"}}>{s.value}</div>
          </div>
        ))}
      </div>
      {year<10&&currentEvent&&(
        <div>
          <div style={{background:currentEvent.type==="bad"?"rgba(239,68,68,.12)":currentEvent.type==="great"?"rgba(16,185,129,.12)":"rgba(99,102,241,.12)",borderRadius:12,padding:"1.25rem",marginBottom:14,border:`1px solid ${currentEvent.type==="bad"?"#ef4444":currentEvent.type==="great"?"#10b981":"#6366f1"}`}}>
            <div style={{color:"#64748b",fontSize:12,marginBottom:4}}>Year {year+1} Market News:</div>
            <p style={{margin:0,fontSize:15,fontWeight:"bold"}}>{currentEvent.event}</p>
          </div>
          <div style={{display:"flex",gap:8}}>
            {[{choice:"sell",label:"😰 Panic Sell",bg:"rgba(239,68,68,.15)",border:"#ef4444",color:"#f87171"},{choice:"stay",label:"🧘 Stay In",bg:"rgba(99,102,241,.15)",border:"#6366f1",color:"#818cf8"},{choice:"buy",label:"💪 Buy More",bg:"rgba(16,185,129,.15)",border:"#10b981",color:"#6ee7b7"}].map(b=>(
              <button key={b.choice} onClick={()=>advance(b.choice)} style={{flex:1,background:b.bg,border:`1px solid ${b.border}`,borderRadius:10,padding:"11px",color:b.color,cursor:"pointer",fontSize:13,fontWeight:"bold"}}>
                {b.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {year===10&&<div style={{textAlign:"center",padding:"1.5rem",background:gain>=0?"rgba(16,185,129,.12)":"rgba(239,68,68,.12)",borderRadius:12,border:`1px solid ${gain>=0?"#10b981":"#ef4444"}`}}>
        <div style={{fontSize:44,marginBottom:8}}>{gain>5000?"🏆":gain>0?"✅":"📚"}</div>
        <h3 style={{color:"#f5c842",marginBottom:6}}>Simulation Complete!</h3>
        <p style={{color:"#94a3b8",margin:0}}>Final: ${Math.round(portfolio).toLocaleString()} | {gain>=0?"Gain":"Loss"}: ${Math.abs(Math.round(gain)).toLocaleString()}</p>
      </div>}
      {log.length>0&&<div style={{marginTop:14,maxHeight:160,overflowY:"auto"}}>
        {log.slice(-4).map((e,i)=>(
          <div key={i} style={{fontSize:12,color:"#64748b",padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
            Y{e.year}: {e.choice.toUpperCase()} — {e.outcome}
          </div>
        ))}
      </div>}
    </div>
  );
}

function TaxBracketGame({onClose}){
  const [income,setIncome]=useState(60000);
  const brackets=[{min:0,max:11000,rate:.10},{min:11000,max:44725,rate:.12},{min:44725,max:95375,rate:.22},{min:95375,max:200000,rate:.24}];
  let taxTotal=0;
  const breakdown=brackets.map(b=>{
    if(income<=b.min)return{...b,taxable:0,tax:0};
    const taxable=Math.min(income,b.max)-b.min;
    const tax=taxable*b.rate;
    taxTotal+=tax;
    return{...b,taxable,tax};
  });
  const effectiveRate=(taxTotal/income)*100;
  return(
    <div style={{padding:"1.5rem",color:"#e2e8f0",fontFamily:"Georgia,serif"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{color:"#f5c842",margin:0}}>🗼 Tax Bracket Visualizer</h2>
        <button onClick={onClose} style={{background:"rgba(255,255,255,.08)",border:"none",color:"#94a3b8",borderRadius:8,padding:"8px 14px",cursor:"pointer"}}>Close</button>
      </div>
      <div style={{marginBottom:18}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
          <span style={{color:"#94a3b8",fontSize:13}}>Annual Income</span>
          <span style={{color:"#f5c842",fontWeight:"bold"}}>${income.toLocaleString()}</span>
        </div>
        <input type="range" min={10000} max={200000} step={1000} value={income} onChange={e=>setIncome(Number(e.target.value))} style={{width:"100%",accentColor:"#6366f1"}}/>
      </div>
      <div style={{marginBottom:16}}>
        {breakdown.map((b,i)=>{
          if(b.taxable<=0)return null;
          const pct=(b.taxable/income)*100;
          return(
            <div key={i} style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}>
                <span style={{color:"#94a3b8"}}>{Math.round(b.rate*100)}% bracket (${b.min.toLocaleString()}–${b.max===200000?"200K+":b.max.toLocaleString()})</span>
                <span style={{color:"#e2e8f0"}}>Tax: ${Math.round(b.tax).toLocaleString()}</span>
              </div>
              <div style={{background:"rgba(255,255,255,.08)",borderRadius:4,height:10}}>
                <div style={{background:`hsl(${220+i*20},80%,60%)`,borderRadius:4,height:"100%",width:`${pct}%`,transition:"width .3s"}}/>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
        {[{label:"Total Tax",value:`$${Math.round(taxTotal).toLocaleString()}`,color:"#ef4444"},{label:"Effective Rate",value:`${effectiveRate.toFixed(1)}%`,color:"#f59e0b"},{label:"Take-Home",value:`$${Math.round(income-taxTotal).toLocaleString()}`,color:"#10b981"}].map(s=>(
          <div key={s.label} style={{background:"rgba(255,255,255,.05)",borderRadius:10,padding:"12px",textAlign:"center"}}>
            <div style={{color:"#64748b",fontSize:11,marginBottom:3}}>{s.label}</div>
            <div style={{color:s.color,fontSize:18,fontWeight:"bold"}}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{background:"rgba(99,102,241,.08)",borderRadius:12,padding:"1rem",border:"1px solid rgba(99,102,241,.2)"}}>
        <p style={{margin:0,color:"#a78bfa",fontSize:13}}>💡 Common myth busted: Moving into a higher bracket does NOT mean all your income is taxed at that rate — only the dollars above the threshold are taxed at the higher rate.</p>
      </div>
    </div>
  );
}

function FICalculatorGame({onClose}){
  const [expenses,setExpenses]=useState(4000);
  const [savings,setSavings]=useState(1500);
  const [currentSavings,setCurrentSavings]=useState(50000);
  const [returnRate,setReturnRate]=useState(7);
  const annualExpenses=expenses*12;
  const fiNumber=annualExpenses*25;
  const annualSavings=savings*12;
  const remaining=fiNumber-currentSavings;
  const yearsToFI=remaining>0?Math.log(fiNumber/currentSavings)/Math.log(1+annualSavings/currentSavings+(returnRate/100)):0;
  return(
    <div style={{padding:"1.5rem",color:"#e2e8f0",fontFamily:"Georgia,serif"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{color:"#f5c842",margin:0}}>🔥 FI Number Calculator</h2>
        <button onClick={onClose} style={{background:"rgba(255,255,255,.08)",border:"none",color:"#94a3b8",borderRadius:8,padding:"8px 14px",cursor:"pointer"}}>Close</button>
      </div>
      {[{label:"Monthly Expenses ($)",val:expenses,set:setExpenses,min:1000,max:10000,step:100},{label:"Monthly Savings ($)",val:savings,set:setSavings,min:100,max:5000,step:50},{label:"Current Savings ($)",val:currentSavings,set:setCurrentSavings,min:0,max:500000,step:5000},{label:"Expected Return (%)",val:returnRate,set:setReturnRate,min:4,max:12,step:.5}].map(s=>(
        <div key={s.label} style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{color:"#94a3b8",fontSize:13}}>{s.label}</span>
            <span style={{color:"#f5c842",fontWeight:"bold"}}>{s.label.includes("%")?`${s.val}%`:`$${s.val.toLocaleString()}`}</span>
          </div>
          <input type="range" min={s.min} max={s.max} step={s.step} value={s.val} onChange={e=>s.set(Number(e.target.value))} style={{width:"100%",accentColor:"#6366f1"}}/>
        </div>
      ))}
      <div style={{background:"rgba(245,200,66,.08)",borderRadius:16,padding:"1.5rem",border:"1px solid rgba(245,200,66,.2)",textAlign:"center",marginBottom:14}}>
        <div style={{color:"#64748b",fontSize:13,marginBottom:4}}>Your FI Number</div>
        <div style={{color:"#f5c842",fontSize:36,fontWeight:"bold",marginBottom:8}}>${fiNumber.toLocaleString()}</div>
        <div style={{color:"#94a3b8",fontSize:13}}>Estimated years to FI: <strong style={{color:"#10b981"}}>{yearsToFI>0?Math.round(yearsToFI)+" years":"Already there! 🎉"}</strong></div>
      </div>
      <div style={{background:"rgba(16,185,129,.08)",borderRadius:12,padding:"1rem",border:"1px solid rgba(16,185,129,.2)"}}>
        <p style={{margin:0,color:"#6ee7b7",fontSize:13}}>💡 FI Number = Annual Expenses × 25. With a 4% withdrawal rate, your portfolio theoretically lasts indefinitely.</p>
      </div>
    </div>
  );
}

// ─── SKILL TREE ──────────────────────────────────────────────────────────────
function SkillTreeView({unlockedSkills,skillPoints,onUnlock}){
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <h1 style={{color:"#f5c842",fontSize:26,marginBottom:2}}>🌳 Skill Tree</h1>
          <p style={{color:"#64748b",margin:0}}>Specialize your financial character</p>
        </div>
        <div style={{background:"rgba(245,200,66,.12)",border:"1px solid rgba(245,200,66,.25)",borderRadius:12,padding:"10px 18px",textAlign:"center"}}>
          <div style={{color:"#f5c842",fontSize:24,fontWeight:"bold"}}>{skillPoints}</div>
          <div style={{color:"#64748b",fontSize:12}}>Skill Points</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
        {Object.entries(SKILL_TREE).map(([key,branch])=>(
          <div key={key} style={{background:"#111827",borderRadius:16,padding:"1.25rem",border:`1px solid ${branch.color}33`}}>
            <div style={{textAlign:"center",marginBottom:16}}>
              <div style={{fontSize:30,marginBottom:4}}>{branch.icon}</div>
              <div style={{color:branch.color,fontWeight:"bold",fontSize:15}}>{branch.label}</div>
              <div style={{color:"#64748b",fontSize:12}}>{branch.desc}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {branch.skills.map(skill=>{
                const unlocked=unlockedSkills.includes(skill.id);
                const reqMet=!skill.requires||unlockedSkills.includes(skill.requires);
                const canUnlock=!unlocked&&reqMet&&skillPoints>=skill.cost;
                return(
                  <div key={skill.id} style={{background:unlocked?"rgba(16,185,129,.1)":"rgba(255,255,255,.04)",borderRadius:10,padding:"10px",border:`1px solid ${unlocked?"#10b981":reqMet?"rgba(255,255,255,.1)":"rgba(255,255,255,.04)"}`,opacity:reqMet?1:.5}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:4}}>
                      <span style={{color:unlocked?"#10b981":"#e2e8f0",fontSize:13,fontWeight:"bold"}}>{skill.name}</span>
                      {!unlocked&&<span style={{color:"#f5c842",fontSize:11,background:"rgba(245,200,66,.1)",padding:"2px 6px",borderRadius:4,flexShrink:0}}>{skill.cost} SP</span>}
                      {unlocked&&<span style={{color:"#10b981",fontSize:14}}>✓</span>}
                    </div>
                    <div style={{color:"#64748b",fontSize:12,marginBottom:canUnlock?8:0}}>{skill.effect}</div>
                    {canUnlock&&<button onClick={()=>onUnlock(skill.id,skill.cost)} style={{background:branch.color,border:"none",borderRadius:6,padding:"4px 10px",color:"#fff",fontSize:12,cursor:"pointer",fontWeight:"bold",width:"100%"}}>Unlock</button>}
                    {!reqMet&&<div style={{color:"#475569",fontSize:11}}>Requires: {skill.requires}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DAILY CHALLENGES ─────────────────────────────────────────────────────────
function DailyChallenges({gameState,onClaimChallenge}){
  const challenges=[
    {id:"dc1",title:"Daily Dose of Learning",desc:"Complete one educational quest",icon:"📚",xp:50,gold:25,done:gameState.completedQuests.length>0},
    {id:"dc2",title:"Budget Check",desc:"Review your financial stats dashboard",icon:"💰",xp:50,gold:25,done:gameState.completedQuests.length>=2},
    {id:"dc3",title:"Market Watch",desc:"Play any mini-game today",icon:"📊",xp:50,gold:25,done:gameState.completedQuests.length>=3},
    {id:"dc4",title:"Savings Streak",desc:"Maintain your daily streak",icon:"🔥",xp:75,gold:35,done:gameState.streak>=7},
    {id:"dc5",title:"Mini-Game Master",desc:"Score above 80% in any quest",icon:"🎮",xp:100,gold:50,done:gameState.completedQuests.length>=4},
  ];
  const weekly=[
    {id:"wc1",title:"Quest Completion",desc:"Finish 3 quests this week",progress:`${Math.min(3,gameState.completedQuests.length)}/3`,done:gameState.completedQuests.length>=3,xp:200,gold:100},
    {id:"wc2",title:"Financial Growth",desc:"Reach 500 Gold",progress:`${Math.min(500,gameState.gold)}/500`,done:gameState.gold>=500,xp:300,gold:150},
    {id:"wc3",title:"Achievement Hunter",desc:"Unlock 3 achievements",progress:`${Math.min(3,gameState.achievements.length)}/3`,done:gameState.achievements.length>=3,xp:250,gold:125},
    {id:"wc4",title:"Level Up",desc:"Reach Level 5",progress:`${Math.min(5,gameState.level)}/5`,done:gameState.level>=5,xp:500,gold:250},
  ];
  return(
    <div>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
        <div>
          <h1 style={{color:"#f5c842",fontSize:26,marginBottom:2}}>📅 Daily Challenges</h1>
          <p style={{color:"#64748b",margin:0}}>Complete challenges for bonus XP and Gold</p>
        </div>
        <div style={{marginLeft:"auto",background:"rgba(239,68,68,.12)",border:"1px solid rgba(239,68,68,.25)",borderRadius:12,padding:"10px 18px",textAlign:"center"}}>
          <div style={{color:"#f87171",fontSize:22,fontWeight:"bold"}}>🔥 {gameState.streak}</div>
          <div style={{color:"#64748b",fontSize:12}}>Day Streak</div>
        </div>
      </div>
      <h3 style={{color:"#e2e8f0",fontSize:16,marginBottom:12}}>⚡ Today's Challenges</h3>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:28}}>
        {challenges.map(c=>(
          <div key={c.id} style={{background:"#111827",borderRadius:14,padding:"1.1rem",border:`1px solid ${c.done?"rgba(16,185,129,.3)":"rgba(255,255,255,.07)"}`}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <span style={{fontSize:24}}>{c.icon}</span>
              <div>
                <div style={{color:c.done?"#10b981":"#e2e8f0",fontWeight:"bold",fontSize:14}}>{c.title}</div>
                <div style={{color:"#64748b",fontSize:12}}>{c.desc}</div>
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",gap:10}}>
                <span style={{color:"#a78bfa",fontSize:12}}>+{c.xp} XP</span>
                <span style={{color:"#f5c842",fontSize:12}}>+{c.gold} Gold</span>
              </div>
              <span style={{fontSize:18}}>{c.done?"✅":"⭕"}</span>
            </div>
          </div>
        ))}
      </div>
      <h3 style={{color:"#e2e8f0",fontSize:16,marginBottom:12}}>📅 Weekly Challenges</h3>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {weekly.map(c=>(
          <div key={c.id} style={{background:"#111827",borderRadius:14,padding:"1.1rem",border:`1px solid ${c.done?"rgba(16,185,129,.3)":"rgba(255,255,255,.07)"}`,display:"flex",alignItems:"center",gap:16}}>
            <span style={{fontSize:20}}>{c.done?"✅":"⭕"}</span>
            <div style={{flex:1}}>
              <div style={{color:c.done?"#10b981":"#e2e8f0",fontWeight:"bold",fontSize:14}}>{c.title}</div>
              <div style={{color:"#64748b",fontSize:12}}>{c.desc} — {c.progress}</div>
              <div style={{background:"rgba(255,255,255,.08)",borderRadius:4,height:5,marginTop:6}}>
                <div style={{background:c.done?"#10b981":"#6366f1",borderRadius:4,height:"100%",width:c.progress.includes("/")?`${(parseInt(c.progress)*100)/parseInt(c.progress.split("/")[1])}%`:"0%",maxWidth:"100%",transition:"width .3s"}}/>
              </div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{color:"#a78bfa",fontSize:12}}>+{c.xp} XP</div>
              <div style={{color:"#f5c842",fontSize:12}}>+{c.gold} Gold</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SOCIAL / GUILD VIEW ──────────────────────────────────────────────────────
function SocialView({player,gameState}){
  const [tab,setTab]=useState("leaderboard");
  const mockPlayers=[
    {rank:1,name:"FinanceWizard",level:42,gold:15800,icon:"🥇"},
    {rank:2,name:"BudgetMaster_Pro",level:38,gold:12200,icon:"🥈"},
    {rank:3,name:"DebtSlayer99",level:35,gold:9800,icon:"🥉"},
    {rank:4,name:"InvestorMindset",level:29,gold:7600,icon:"4️⃣"},
    {rank:5,name:player?.name||"You",level:gameState.level,gold:gameState.gold,icon:"⭐",isPlayer:true},
    {rank:6,name:"FIREchaser",level:22,gold:5100,icon:"6️⃣"},
  ].sort((a,b)=>b.level-a.level||b.gold-a.gold);
  const guild={name:"Wealth Builders Guild",members:23,level:8,desc:"A collaborative guild for financial education and friendly competition."};
  return(
    <div>
      <h1 style={{color:"#f5c842",fontSize:26,marginBottom:4}}>🌐 Social Hub</h1>
      <p style={{color:"#64748b",marginBottom:20}}>Compete, collaborate, and learn together</p>
      <div style={{display:"flex",gap:8,marginBottom:22}}>
        {[{id:"leaderboard",label:"🏅 Leaderboard"},{id:"guild",label:"⚔️ Guild"},{id:"mentorship",label:"🎓 Mentorship"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{background:tab===t.id?"rgba(99,102,241,.2)":"rgba(255,255,255,.04)",border:`1px solid ${tab===t.id?"rgba(99,102,241,.4)":"rgba(255,255,255,.08)"}`,borderRadius:10,padding:"8px 14px",color:tab===t.id?"#a78bfa":"#94a3b8",cursor:"pointer",fontSize:13,fontWeight:tab===t.id?"bold":"normal"}}>
            {t.label}
          </button>
        ))}
      </div>
      {tab==="leaderboard"&&(
        <div>
          <div style={{background:"#111827",borderRadius:16,padding:"1.25rem",border:"1px solid rgba(255,255,255,.07)",marginBottom:16}}>
            <h3 style={{color:"#e2e8f0",marginBottom:14,fontSize:16}}>🌟 Global Rankings</h3>
            {mockPlayers.map((p,i)=>(
              <div key={p.name} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 8px",borderBottom:i<5?"1px solid rgba(255,255,255,.05)":"none",background:p.isPlayer?"rgba(99,102,241,.06)":"transparent",borderRadius:8,margin:"2px 0"}}>
                <div style={{width:32,textAlign:"center",fontSize:i<3?20:15,fontWeight:"bold",color:i<3?"#f5c842":"#64748b"}}>{i<3?["🥇","🥈","🥉"][i]:i+1}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:p.isPlayer?"bold":"normal",color:p.isPlayer?"#818cf8":"#e2e8f0",fontSize:14}}>{p.name}{p.isPlayer?" (You)":""}</div>
                  <div style={{color:"#64748b",fontSize:12}}>Level {p.level}</div>
                </div>
                <div style={{color:"#f5c842",fontWeight:"bold",fontSize:13}}>💰 {p.gold.toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div style={{background:"#111827",borderRadius:14,padding:"1.1rem",border:"1px solid rgba(255,255,255,.07)"}}>
              <h4 style={{color:"#f5c842",marginBottom:10,fontSize:14}}>📊 Your Rankings</h4>
              {[{label:"Level Rank",value:"#5"},{label:"Gold Rank",value:"#5"},{label:"Quests Done",value:`#${Math.max(1,10-gameState.completedQuests.length)}`},{label:"Achievements",value:`#${Math.max(1,15-gameState.achievements.length)}`}].map(r=>(
                <div key={r.label} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                  <span style={{color:"#64748b",fontSize:13}}>{r.label}</span>
                  <span style={{color:"#f5c842",fontWeight:"bold"}}>{r.value}</span>
                </div>
              ))}
            </div>
            <div style={{background:"#111827",borderRadius:14,padding:"1.1rem",border:"1px solid rgba(255,255,255,.07)"}}>
              <h4 style={{color:"#f5c842",marginBottom:10,fontSize:14}}>🎯 Weekly Challenges</h4>
              {[{task:"Complete 3 quests",done:gameState.completedQuests.length>=3},{task:"Reach 500 Gold",done:gameState.gold>=500},{task:"Unlock 3 achievements",done:gameState.achievements.length>=3},{task:"Reach Level 5",done:gameState.level>=5}].map(c=>(
                <div key={c.task} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                  <span style={{fontSize:13}}>{c.done?"✅":"⭕"}</span>
                  <span style={{color:c.done?"#10b981":"#94a3b8",fontSize:13}}>{c.task}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {tab==="guild"&&(
        <div>
          <div style={{background:"linear-gradient(135deg,rgba(99,102,241,.15),rgba(139,92,246,.1))",borderRadius:16,padding:"1.5rem",border:"1px solid rgba(99,102,241,.25)",marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}>
              <span style={{fontSize:40}}>⚔️</span>
              <div>
                <h3 style={{color:"#f5c842",margin:0,fontSize:20}}>{guild.name}</h3>
                <div style={{color:"#64748b",fontSize:13}}>{guild.members} members · Guild Level {guild.level}</div>
              </div>
            </div>
            <p style={{color:"#94a3b8",margin:"0 0 14px",fontSize:14}}>{guild.desc}</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {[{label:"Members",value:guild.members},{label:"Guild Level",value:guild.level},{label:"Weekly XP",value:"12,450"}].map(s=>(
                <div key={s.label} style={{background:"rgba(255,255,255,.06)",borderRadius:10,padding:"10px",textAlign:"center"}}>
                  <div style={{color:"#f5c842",fontSize:18,fontWeight:"bold"}}>{s.value}</div>
                  <div style={{color:"#64748b",fontSize:12}}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:"#111827",borderRadius:14,padding:"1.1rem",border:"1px solid rgba(255,255,255,.07)",marginBottom:14}}>
            <h4 style={{color:"#e2e8f0",marginBottom:12,fontSize:15}}>Guild Perks</h4>
            {["+5% XP bonus for all guild members","Access to guild-exclusive quests","Shared learning resources library","Guild study groups for financial topics","Inter-guild competition events"].map((p,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                <span style={{color:"#10b981"}}>✓</span>
                <span style={{color:"#94a3b8",fontSize:13}}>{p}</span>
              </div>
            ))}
          </div>
          <button style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:12,padding:"12px",fontSize:14,cursor:"pointer",width:"100%",fontWeight:"bold"}}>Join Guild ⚔️</button>
        </div>
      )}
      {tab==="mentorship"&&(
        <div>
          <div style={{background:"rgba(16,185,129,.08)",borderRadius:16,padding:"1.25rem",border:"1px solid rgba(16,185,129,.2)",marginBottom:16}}>
            <h3 style={{color:"#10b981",marginBottom:8,fontSize:17}}>🎓 Mentorship Program</h3>
            <p style={{color:"#94a3b8",margin:0,fontSize:14}}>Connect with experienced players (Level 30+) for personalized financial guidance, or mentor newcomers once you've gained mastery.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
            <div style={{background:"#111827",borderRadius:14,padding:"1.1rem",border:"1px solid rgba(255,255,255,.07)"}}>
              <h4 style={{color:"#f5c842",marginBottom:10,fontSize:14}}>For Mentees</h4>
              {["Personalized financial guidance","Weekly check-in sessions","Quest walkthroughs","Goal setting & tracking","Accountability partner"].map((b,i)=>(
                <div key={i} style={{display:"flex",gap:8,padding:"4px 0"}}>
                  <span style={{color:"#3b82f6"}}>→</span>
                  <span style={{color:"#94a3b8",fontSize:12}}>{b}</span>
                </div>
              ))}
            </div>
            <div style={{background:"#111827",borderRadius:14,padding:"1.1rem",border:"1px solid rgba(255,255,255,.07)"}}>
              <h4 style={{color:"#f5c842",marginBottom:10,fontSize:14}}>For Mentors</h4>
              {["Teaching reinforces your learning","Special mentor achievements","XP bonuses for mentee success","Mentor title & badge","Satisfaction of helping others"].map((b,i)=>(
                <div key={i} style={{display:"flex",gap:8,padding:"4px 0"}}>
                  <span style={{color:"#10b981"}}>→</span>
                  <span style={{color:"#94a3b8",fontSize:12}}>{b}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:"#111827",borderRadius:14,padding:"1.1rem",border:"1px solid rgba(255,255,255,.07)"}}>
            <h4 style={{color:"#e2e8f0",marginBottom:12,fontSize:15}}>Requirements to Become a Mentor</h4>
            {[{req:"Level 30+ character",met:gameState.level>=30},{req:"100+ quests completed",met:gameState.completedQuests.length>=100},{req:"Good standing (no violations)",met:true},{req:"Opt-in to mentorship program",met:false}].map((r,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                <span style={{fontSize:14}}>{r.met?"✅":"⭕"}</span>
                <span style={{color:r.met?"#10b981":"#64748b",fontSize:13}}>{r.req}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App(){
  const [gameStarted,setGameStarted]=useState(false);
  const [player,setPlayer]=useState(null);
  const [gameState,setGameState]=useState(INITIAL_STATE);
  const [view,setView]=useState("dashboard");
  const [activeQuest,setActiveQuest]=useState(null);
  const [activeMiniGame,setActiveMiniGame]=useState(null);
  const [notification,setNotification]=useState(null);
  const [newAchievements,setNewAchievements]=useState([]);

  const xpNeeded=xpToNextLevel(gameState.level);
  const xpPercent=Math.min(100,(gameState.xp/xpNeeded)*100);

  function showNotification(msg,type="info"){setNotification({msg,type});setTimeout(()=>setNotification(null),3500);}

  function completeQuest(result){
    setActiveQuest(null);
    const ns={...gameState};
    ns.xp+=result.xp;
    ns.gold+=result.gold;
    ns.completedQuests=[...ns.completedQuests,result.questId];
    // level up
    while(ns.xp>=xpToNextLevel(ns.level)){
      ns.xp-=xpToNextLevel(ns.level);
      ns.level+=1;
      ns.skillPoints+=1;
      showNotification(`🎉 Level Up! You're now Level ${ns.level}!`,"success");
    }
    // financial stat updates
    if(result.questId==="q2")ns.financialStats={...ns.financialStats,emergencyFund:1000};
    if(result.questId==="q3")ns.financialStats={...ns.financialStats,creditScore:Math.min(850,ns.financialStats.creditScore+30)};
    if(result.questId==="q4")ns.financialStats={...ns.financialStats,debtLevel:Math.max(0,ns.financialStats.debtLevel-15000)};
    if(result.questId==="q5")ns.financialStats={...ns.financialStats,netWorth:ns.financialStats.netWorth+5000};
    if(result.questId==="q6")ns.financialStats={...ns.financialStats,netWorth:ns.financialStats.netWorth+10000};
    if(result.questId==="q11")ns.financialStats={...ns.financialStats,creditScore:Math.min(850,ns.financialStats.creditScore+20)};
    // achievements
    const earned=[];
    const add=(id)=>{if(!ns.achievements.includes(id))earned.push(id);};
    if(ns.completedQuests.length===1)add("first_steps");
    if(ns.completedQuests.includes("q2"))add("emergency_ready");
    if(ns.completedQuests.includes("q3"))add("credit_master");
    if(ns.completedQuests.includes("q4"))add("debt_destroyer");
    if(ns.completedQuests.includes("q5"))add("first_investor");
    if(ns.completedQuests.includes("q7"))add("tax_savvy");
    if(ns.completedQuests.includes("q8"))add("homeowner");
    if(ns.completedQuests.includes("q9"))add("insurance_pro");
    if(ns.completedQuests.includes("q10"))add("budget_guru");
    if(ns.completedQuests.includes("q11"))add("credit_analyst");
    if(ns.completedQuests.includes("q12"))add("fi_ready");
    if(result.score===100)add("perfect_score");
    if(ns.level>=5)add("level_5");
    if(ns.level>=10)add("level_10");
    if(ns.level>=20)add("level_20");
    if(ns.gold>=1000)add("wealth_1k");
    if(ns.gold>=5000)add("wealth_5k");
    if(result.timeTaken<60)add("speed_learner");
    if(ns.streak>=7)add("streak_7");
    if(ns.completedQuests.length>=6)add("quest_master");
    ns.achievements=[...ns.achievements,...earned];
    if(earned.length>0)setNewAchievements(earned);
    setGameState(ns);
    setView("dashboard");
    showNotification(`✨ Quest complete! +${result.xp} XP, +${result.gold} Gold`,"success");
  }

  function unlockSkill(skillId,cost){
    if(gameState.skillPoints<cost)return;
    setGameState(s=>({...s,skillPoints:s.skillPoints-cost,unlockedSkills:[...s.unlockedSkills,skillId]}));
    showNotification(`🌟 Skill unlocked!`,"success");
  }

  if(!gameStarted)return<CharacterCreation onStart={(p)=>{setPlayer(p);setGameStarted(true);}}/>;
  if(activeQuest)return<QuestScreen quest={activeQuest} onComplete={completeQuest} onBack={()=>setActiveQuest(null)} difficulty={player?.difficulty}/>;

  const availableQuests=QUESTS.filter(q=>!gameState.completedQuests.includes(q.id)&&q.requiredLevel<=gameState.level);
  const completedQuests=QUESTS.filter(q=>gameState.completedQuests.includes(q.id));
  const lockedQuests=QUESTS.filter(q=>!gameState.completedQuests.includes(q.id)&&q.requiredLevel>gameState.level);

  const navItems=[
    {id:"dashboard",label:"Dashboard",icon:"🏠"},
    {id:"quests",label:"Quest Board",icon:"📋",badge:availableQuests.length},
    {id:"minigames",label:"Mini-Games",icon:"🎮"},
    {id:"skills",label:"Skill Tree",icon:"🌳"},
    {id:"dailies",label:"Challenges",icon:"📅"},
    {id:"achievements",label:"Achievements",icon:"🏆"},
    {id:"stats",label:"Character",icon:"📊"},
    {id:"social",label:"Social Hub",icon:"🌐"},
  ];

  const s={
    page:{minHeight:"100vh",background:"#080b14",color:"#e2e8f0",fontFamily:"'Georgia',serif"},
    sidebar:{width:210,background:"#0d1220",borderRight:"1px solid rgba(255,255,255,.06)",display:"flex",flexDirection:"column",padding:"1.25rem .875rem",flexShrink:0},
    main:{flex:1,padding:"1.75rem 2rem",overflowY:"auto",maxHeight:"calc(100vh - 56px)"},
    card:{background:"#111827",borderRadius:16,padding:"1.5rem",border:"1px solid rgba(255,255,255,.07)",marginBottom:16},
    navBtn:(active)=>({background:active?"rgba(99,102,241,.18)":"transparent",border:`1px solid ${active?"rgba(99,102,241,.3)":"transparent"}`,borderRadius:9,padding:"9px 12px",color:active?"#a78bfa":"#64748b",cursor:"pointer",fontSize:13,textAlign:"left",width:"100%",marginBottom:3,display:"flex",alignItems:"center",gap:9,transition:"all .15s"}),
    statBadge:(color)=>({background:`${color}18`,border:`1px solid ${color}38`,borderRadius:12,padding:"14px 10px",textAlign:"center"}),
  };

  return(
    <div style={{...s.page,display:"flex",flexDirection:"column"}}>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}@keyframes popIn{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}`}</style>
      {/* Top bar */}
      <div style={{background:"#0d1220",borderBottom:"1px solid rgba(255,255,255,.06)",padding:"0 1.5rem",height:56,display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
        <span style={{fontSize:20}}>🏰</span>
        <span style={{color:"#f5c842",fontWeight:"bold",fontSize:17,flex:1,letterSpacing:.5}}>Financial RPG Quest</span>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <div>
            <div style={{color:"#64748b",fontSize:10,marginBottom:2}}>XP to Lv.{gameState.level+1}</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{background:"rgba(255,255,255,.08)",borderRadius:4,height:6,width:110}}>
                <div style={{background:"linear-gradient(90deg,#6366f1,#a78bfa)",borderRadius:4,height:"100%",width:`${xpPercent}%`,transition:"width .3s"}}/>
              </div>
              <span style={{color:"#a78bfa",fontSize:11}}>{gameState.xp}/{xpNeeded}</span>
            </div>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{color:"#f5c842",fontWeight:"bold",fontSize:17}}>Lv.{gameState.level}</div>
            <div style={{color:"#64748b",fontSize:11}}>{player?.name}</div>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{color:"#f5c842",fontWeight:"bold"}}>💰 {gameState.gold.toLocaleString()}</div>
            <div style={{color:"#64748b",fontSize:11}}>Gold</div>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{color:"#ef4444",fontWeight:"bold"}}>🔥 {gameState.streak}</div>
            <div style={{color:"#64748b",fontSize:11}}>Streak</div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notification&&(
        <div style={{position:"fixed",top:66,right:20,zIndex:1000,background:notification.type==="success"?"rgba(16,185,129,.9)":"rgba(99,102,241,.9)",color:"#fff",borderRadius:12,padding:"11px 18px",fontWeight:"bold",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,.2)",maxWidth:320,animation:"slideIn .3s ease"}}>
          {notification.msg}
        </div>
      )}

      {/* Achievement popups */}
      {newAchievements.length>0&&(
        <div style={{position:"fixed",bottom:20,right:20,zIndex:1000,display:"flex",flexDirection:"column",gap:8}}>
          {newAchievements.slice(0,3).map(id=>{
            const ach=ACHIEVEMENTS.find(a=>a.id===id);
            if(!ach)return null;
            const rc=rarityColors[ach.rarity];
            return(
              <div key={id} style={{background:rc.bg,border:`1px solid ${rc.border}`,borderRadius:12,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,boxShadow:"0 8px 32px rgba(0,0,0,.5)",cursor:"pointer",animation:"popIn .3s ease",maxWidth:260}} onClick={()=>setNewAchievements(p=>p.filter(a=>a!==id))}>
                <span style={{fontSize:26}}>{ach.icon}</span>
                <div>
                  <div style={{color:rc.text,fontWeight:"bold",fontSize:12}}>Achievement Unlocked!</div>
                  <div style={{color:rc.text,fontSize:14}}>{ach.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {/* Sidebar */}
        <div style={s.sidebar}>
          <div style={{marginBottom:20}}>
            <div style={{color:"#475569",fontSize:10,marginBottom:8,letterSpacing:2,textTransform:"uppercase",paddingLeft:4}}>Navigation</div>
            {navItems.map(nav=>(
              <button key={nav.id} onClick={()=>setView(nav.id)} style={s.navBtn(view===nav.id)}>
                <span style={{fontSize:15}}>{nav.icon}</span>
                <span>{nav.label}</span>
                {nav.badge>0&&<span style={{marginLeft:"auto",background:"#ef4444",borderRadius:"50%",width:17,height:17,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:"bold",flexShrink:0}}>{nav.badge}</span>}
              </button>
            ))}
          </div>
          <div style={{marginTop:"auto",background:"rgba(255,255,255,.03)",borderRadius:10,padding:"10px",border:"1px solid rgba(255,255,255,.06)"}}>
            <div style={{color:"#475569",fontSize:10,marginBottom:6,letterSpacing:2,textTransform:"uppercase"}}>Progress</div>
            <div style={{color:"#94a3b8",fontSize:12,marginBottom:3}}>Quests: {gameState.completedQuests.length}/{QUESTS.length}</div>
            <div style={{color:"#94a3b8",fontSize:12,marginBottom:3}}>Achievements: {gameState.achievements.length}/{ACHIEVEMENTS.length}</div>
            <div style={{color:"#94a3b8",fontSize:12,marginBottom:3}}>Skills: {gameState.unlockedSkills.length}/12</div>
            <div style={{color:"#f5c842",fontSize:12,fontWeight:"bold"}}>Level {gameState.level} Hero</div>
          </div>
        </div>

        {/* Main */}
        <div style={s.main}>

          {/* DASHBOARD */}
          {view==="dashboard"&&(
            <div>
              <h1 style={{color:"#f5c842",fontSize:26,marginBottom:2}}>Welcome back, {player?.name}! ⚔️</h1>
              <p style={{color:"#64748b",marginBottom:22}}>{availableQuests.length>0?`${availableQuests.length} quests await your adventure!`:"All current quests complete! New content unlocks as you level up."}</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:22}}>
                {[
                  {label:"Level",value:gameState.level,icon:"⚔️",color:"#6366f1"},
                  {label:"Gold",value:gameState.gold.toLocaleString(),icon:"💰",color:"#f59e0b"},
                  {label:"Quests Done",value:`${gameState.completedQuests.length}/${QUESTS.length}`,icon:"🏆",color:"#10b981"},
                  {label:"Skill Points",value:gameState.skillPoints,icon:"🌳",color:"#8b5cf6"},
                ].map(stat=>(
                  <div key={stat.label} style={s.statBadge(stat.color)}>
                    <div style={{fontSize:22,marginBottom:3}}>{stat.icon}</div>
                    <div style={{color:stat.color,fontSize:21,fontWeight:"bold"}}>{stat.value}</div>
                    <div style={{color:"#64748b",fontSize:12}}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {availableQuests.length>0&&(
                <div style={s.card}>
                  <h3 style={{color:"#f5c842",marginBottom:14,fontSize:16}}>⚡ Available Quests</h3>
                  <div style={{display:"flex",flexDirection:"column",gap:9}}>
                    {availableQuests.slice(0,4).map(q=>(
                      <button key={q.id} onClick={()=>setActiveQuest(q)} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)",borderRadius:12,padding:"13px 15px",color:"#e2e8f0",cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"all .15s",textAlign:"left"}}>
                        <span style={{fontSize:24,flexShrink:0}}>{q.icon}</span>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:"bold",marginBottom:1,fontSize:14}}>{q.title}</div>
                          <div style={{color:"#64748b",fontSize:12}}>{q.description}</div>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div style={{color:"#a78bfa",fontSize:11}}>+{q.xpReward} XP</div>
                          <div style={{color:"#f5c842",fontSize:11}}>+{q.goldReward} Gold</div>
                          <div style={{color:"#64748b",fontSize:11}}>Lv.{q.difficulty} ⭐</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                <div style={s.card}>
                  <h3 style={{color:"#f5c842",marginBottom:12,fontSize:15}}>📊 Financial Health</h3>
                  {[
                    {label:"Credit Score",value:gameState.financialStats.creditScore,max:850,progress:(gameState.financialStats.creditScore/850)*100,color:"#10b981"},
                    {label:"Emergency Fund",value:`$${gameState.financialStats.emergencyFund.toLocaleString()}`,progress:Math.min(100,(gameState.financialStats.emergencyFund/9000)*100),color:"#3b82f6"},
                    {label:"Debt Remaining",value:`$${gameState.financialStats.debtLevel.toLocaleString()}`,progress:Math.max(0,100-(gameState.financialStats.debtLevel/45000)*100),color:"#ef4444"},
                    {label:"Net Worth",value:`$${gameState.financialStats.netWorth.toLocaleString()}`,progress:Math.min(100,(gameState.financialStats.netWorth/100000)*100),color:"#8b5cf6"},
                  ].map(item=>(
                    <div key={item.label} style={{marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                        <span style={{color:"#64748b",fontSize:12}}>{item.label}</span>
                        <span style={{color:"#e2e8f0",fontSize:12,fontWeight:"bold"}}>{item.value}</span>
                      </div>
                      <div style={{background:"rgba(255,255,255,.08)",borderRadius:4,height:5}}>
                        <div style={{background:item.color,borderRadius:4,height:"100%",width:`${item.progress}%`,transition:"width .5s"}}/>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={s.card}>
                  <h3 style={{color:"#f5c842",marginBottom:12,fontSize:15}}>🏆 Recent Achievements</h3>
                  {gameState.achievements.length===0?(
                    <p style={{color:"#64748b",fontSize:13}}>Complete quests to earn achievements!</p>
                  ):gameState.achievements.slice(-5).map(id=>{
                    const ach=ACHIEVEMENTS.find(a=>a.id===id);
                    if(!ach)return null;
                    const rc=rarityColors[ach.rarity];
                    return(
                      <div key={id} style={{display:"flex",alignItems:"center",gap:9,marginBottom:9,padding:"7px 8px",background:`${rc.bg}22`,borderRadius:8,border:`1px solid ${rc.border}44`}}>
                        <span style={{fontSize:18}}>{ach.icon}</span>
                        <div>
                          <div style={{color:rc.text,fontSize:13,fontWeight:"bold"}}>{ach.name}</div>
                          <div style={{color:"#64748b",fontSize:11}}>{ach.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* QUEST BOARD */}
          {view==="quests"&&(
            <div>
              <h1 style={{color:"#f5c842",fontSize:26,marginBottom:4}}>📋 Quest Board</h1>
              <p style={{color:"#64748b",marginBottom:22}}>{availableQuests.length} quests available · {completedQuests.length} completed · {lockedQuests.length} locked</p>
              {availableQuests.length>0&&(
                <div style={{marginBottom:28}}>
                  <h3 style={{color:"#e2e8f0",fontSize:16,marginBottom:12}}>⚡ Available Quests</h3>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>
                    {availableQuests.map(q=>(
                      <div key={q.id} style={{...s.card,margin:0,cursor:"pointer",transition:"all .2s",borderColor:`${categoryColors[q.category]||"#6366f1"}44`}} onClick={()=>setActiveQuest(q)}>
                        <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:10}}>
                          <span style={{fontSize:32}}>{q.icon}</span>
                          <div style={{flex:1}}>
                            <div style={{fontWeight:"bold",fontSize:15,marginBottom:4}}>{q.title}</div>
                            <span style={{background:`${categoryColors[q.category]||"#6366f1"}28`,color:categoryColors[q.category]||"#818cf8",fontSize:11,padding:"2px 8px",borderRadius:6}}>{q.category.replace("_"," ")}</span>
                          </div>
                        </div>
                        <p style={{color:"#64748b",fontSize:12,marginBottom:12,lineHeight:1.5}}>{q.description}</p>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div style={{display:"flex",gap:14}}>
                            <span style={{color:"#a78bfa",fontSize:12}}>⬆ +{q.xpReward} XP</span>
                            <span style={{color:"#f5c842",fontSize:12}}>💰 +{q.goldReward}</span>
                          </div>
                          <span style={{fontSize:12}}>{"⭐".repeat(Math.min(q.difficulty,5))}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {completedQuests.length>0&&(
                <div style={{marginBottom:22}}>
                  <h3 style={{color:"#e2e8f0",fontSize:16,marginBottom:12}}>✅ Completed Quests</h3>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
                    {completedQuests.map(q=>(
                      <div key={q.id} style={{...s.card,margin:0,opacity:.55}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <span style={{fontSize:22}}>{q.icon}</span>
                          <div>
                            <div style={{color:"#e2e8f0",fontWeight:"bold",fontSize:14}}>{q.title}</div>
                            <div style={{color:"#10b981",fontSize:12}}>✓ Completed</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {lockedQuests.length>0&&(
                <div>
                  <h3 style={{color:"#475569",fontSize:16,marginBottom:12}}>🔒 Locked Quests</h3>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
                    {lockedQuests.map(q=>(
                      <div key={q.id} style={{...s.card,margin:0,opacity:.35}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <span style={{fontSize:22}}>🔒</span>
                          <div>
                            <div style={{color:"#64748b",fontWeight:"bold",fontSize:14}}>{q.title}</div>
                            <div style={{color:"#475569",fontSize:12}}>Requires Level {q.requiredLevel}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MINI-GAMES */}
          {view==="minigames"&&(
            <div>
              <h1 style={{color:"#f5c842",fontSize:26,marginBottom:4}}>🎮 Mini-Game Arcade</h1>
              <p style={{color:"#64748b",marginBottom:22}}>Interactive financial simulations to reinforce your learning</p>
              {activeMiniGame&&(
                <div style={{...s.card,padding:0,overflow:"hidden",marginBottom:20}}>
                  {activeMiniGame==="compound_calc"&&<CompoundInterestGame onClose={()=>setActiveMiniGame(null)}/>}
                  {activeMiniGame==="budget_balancer"&&<BudgetBalancerGame onClose={()=>setActiveMiniGame(null)}/>}
                  {activeMiniGame==="debt_payoff"&&<DebtPayoffGame onClose={()=>setActiveMiniGame(null)}/>}
                  {activeMiniGame==="stock_simulator"&&<StockSimulatorGame onClose={()=>setActiveMiniGame(null)}/>}
                  {activeMiniGame==="tax_bracket"&&<TaxBracketGame onClose={()=>setActiveMiniGame(null)}/>}
                  {activeMiniGame==="fi_calculator"&&<FICalculatorGame onClose={()=>setActiveMiniGame(null)}/>}
                </div>
              )}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
                {MINI_GAMES.map(mg=>(
                  <button key={mg.id} onClick={()=>setActiveMiniGame(mg.id)} style={{...s.card,margin:0,cursor:"pointer",textAlign:"left",transition:"all .2s",border:`1px solid ${activeMiniGame===mg.id?"rgba(99,102,241,.4)":"rgba(255,255,255,.07)"}`}}>
                    <div style={{fontSize:36,marginBottom:10}}>{mg.icon}</div>
                    <div style={{fontWeight:"bold",fontSize:15,marginBottom:5,color:"#e2e8f0"}}>{mg.name}</div>
                    <div style={{color:"#64748b",fontSize:12,marginBottom:10,lineHeight:1.5}}>{mg.desc}</div>
                    <div style={{color:"#6366f1",fontSize:12}}>Play Now →</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SKILL TREE */}
          {view==="skills"&&(
            <SkillTreeView unlockedSkills={gameState.unlockedSkills} skillPoints={gameState.skillPoints} onUnlock={unlockSkill}/>
          )}

          {/* DAILY CHALLENGES */}
          {view==="dailies"&&(
            <DailyChallenges gameState={gameState} onClaimChallenge={()=>{}}/>
          )}

          {/* ACHIEVEMENTS */}
          {view==="achievements"&&(
            <div>
              <h1 style={{color:"#f5c842",fontSize:26,marginBottom:4}}>🏆 Achievements</h1>
              <p style={{color:"#64748b",marginBottom:22}}>{gameState.achievements.length}/{ACHIEVEMENTS.length} unlocked</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
                {ACHIEVEMENTS.map(ach=>{
                  const earned=gameState.achievements.includes(ach.id);
                  const rc=rarityColors[ach.rarity];
                  return(
                    <div key={ach.id} style={{background:earned?rc.bg:"rgba(255,255,255,.04)",borderRadius:12,padding:"1rem",border:`1px solid ${earned?rc.border:"rgba(255,255,255,.07)"}`,opacity:earned?1:.45,transition:"all .2s"}}>
                      <div style={{fontSize:28,marginBottom:6}}>{earned?ach.icon:"🔒"}</div>
                      <div style={{fontWeight:"bold",fontSize:13,color:earned?rc.text:"#64748b",marginBottom:2}}>{ach.name}</div>
                      <div style={{fontSize:11,color:earned?rc.text:"#475569",marginBottom:6,lineHeight:1.4}}>{ach.desc}</div>
                      <div style={{fontSize:10,fontWeight:"bold",color:rc.text,background:`${rc.bg}`,padding:"2px 7px",borderRadius:5,display:"inline-block",border:`1px solid ${rc.border}66`}}>{ach.rarity.toUpperCase()}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CHARACTER STATS */}
          {view==="stats"&&(
            <div>
              <h1 style={{color:"#f5c842",fontSize:26,marginBottom:4}}>📊 Character Sheet</h1>
              <p style={{color:"#64748b",marginBottom:22}}>Your financial health metrics and progression</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                <div style={s.card}>
                  <h3 style={{color:"#a78bfa",marginBottom:14,fontSize:15}}>⚔️ RPG Stats</h3>
                  {[
                    {label:"Level",value:gameState.level,icon:"⚔️"},
                    {label:"Experience",value:`${gameState.xp}/${xpNeeded} XP`,icon:"✨"},
                    {label:"Gold",value:gameState.gold.toLocaleString(),icon:"💰"},
                    {label:"Skill Points",value:gameState.skillPoints,icon:"🌳"},
                    {label:"Skills Unlocked",value:`${gameState.unlockedSkills.length}/12`,icon:"⚡"},
                    {label:"Quests Completed",value:gameState.completedQuests.length,icon:"📋"},
                    {label:"Achievements",value:gameState.achievements.length,icon:"🏆"},
                    {label:"Streak",value:`${gameState.streak} days 🔥`,icon:"📅"},
                    {label:"Difficulty",value:player?.difficulty||"normal",icon:"🎯"},
                  ].map(stat=>(
                    <div key={stat.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
                      <span style={{color:"#64748b",fontSize:13}}>{stat.icon} {stat.label}</span>
                      <span style={{color:"#e2e8f0",fontWeight:"bold",fontSize:13}}>{stat.value}</span>
                    </div>
                  ))}
                </div>
                <div style={s.card}>
                  <h3 style={{color:"#10b981",marginBottom:14,fontSize:15}}>💵 Financial Stats</h3>
                  {[
                    {label:"Credit Score",value:`${gameState.financialStats.creditScore}/850`,color:"#10b981"},
                    {label:"Net Worth",value:`$${gameState.financialStats.netWorth.toLocaleString()}`,color:"#3b82f6"},
                    {label:"Debt Level",value:`$${gameState.financialStats.debtLevel.toLocaleString()}`,color:"#ef4444"},
                    {label:"Emergency Fund",value:`$${gameState.financialStats.emergencyFund.toLocaleString()}`,color:"#f59e0b"},
                  ].map(stat=>(
                    <div key={stat.label} style={{padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                        <span style={{color:"#64748b",fontSize:13}}>{stat.label}</span>
                        <span style={{color:stat.color,fontWeight:"bold",fontSize:13}}>{stat.value}</span>
                      </div>
                    </div>
                  ))}
                  <div style={{marginTop:14,background:"rgba(99,102,241,.08)",borderRadius:10,padding:"11px",border:"1px solid rgba(99,102,241,.18)"}}>
                    <p style={{margin:0,color:"#94a3b8",fontSize:12,lineHeight:1.5}}>💡 Complete more quests to improve your financial stats and unlock your full potential!</p>
                  </div>
                </div>
              </div>
              <div style={{...s.card,gridColumn:"span 2"}}>
                <h3 style={{color:"#f5c842",marginBottom:16,fontSize:15}}>📈 Financial Intelligence Radar</h3>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
                  {[
                    {label:"Budgeting",score:Math.min(100,gameState.completedQuests.filter(q=>["q1","q10"].includes(q)).length*50)},
                    {label:"Saving",score:Math.min(100,gameState.completedQuests.filter(q=>["q2"].includes(q)).length*100)},
                    {label:"Credit",score:Math.min(100,gameState.completedQuests.filter(q=>["q3","q11"].includes(q)).length*50)},
                    {label:"Debt Mgmt",score:Math.min(100,gameState.completedQuests.filter(q=>["q4"].includes(q)).length*100)},
                    {label:"Investing",score:Math.min(100,gameState.completedQuests.filter(q=>["q5","q12"].includes(q)).length*50)},
                    {label:"Retirement",score:Math.min(100,gameState.completedQuests.filter(q=>["q6"].includes(q)).length*100)},
                    {label:"Taxes",score:Math.min(100,gameState.completedQuests.filter(q=>["q7"].includes(q)).length*100)},
                    {label:"Real Estate",score:Math.min(100,gameState.completedQuests.filter(q=>["q8"].includes(q)).length*100)},
                  ].map(skill=>(
                    <div key={skill.label} style={{textAlign:"center"}}>
                      <div style={{color:"#64748b",fontSize:12,marginBottom:6}}>{skill.label}</div>
                      <div style={{position:"relative",display:"inline-block"}}>
                        <svg width={64} height={64} style={{transform:"rotate(-90deg)"}}>
                          <circle cx={32} cy={32} r={26} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={6}/>
                          <circle cx={32} cy={32} r={26} fill="none" stroke="#6366f1" strokeWidth={6} strokeDasharray={`${skill.score*1.633} 163.3`} strokeLinecap="round"/>
                        </svg>
                        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",color:"#e2e8f0",fontSize:13,fontWeight:"bold"}}>{skill.score}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SOCIAL HUB */}
          {view==="social"&&(
            <SocialView player={player} gameState={gameState}/>
          )}

        </div>
      </div>
    </div>
  );
}
