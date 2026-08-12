import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Home,
  WalletCards,
  UserRound,
  Copy,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  UsersRound,
  ShieldCheck,
  Headphones,
  LockKeyhole,
  Gift,
  Send,
  Share2,
  CheckCircle2,
  Clock3,
  XCircle,
  LogOut,
  PlayCircle,
  PlusCircle,
  TrendingUp,
  ReceiptText,
  Zap,
  Smartphone,
  BarChart3,
  CalendarDays,
  Search,
  ArrowDownCircle,
  ArrowUpCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import "./style.css";
const seed = [101, 110, 120, 125, 139, 140, 143].map((x, i) => ({
  id: `CP-${10640 + i}`,
  amount: x,
  qty: [2, 33, 3, 1, 1, 2, 5][i],
  reward: +(x * 0.03).toFixed(2),
  status: "OPEN",
}));
const cash = (n) =>
    "₹" +
    Number(n).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  tabs = ["Unfinished", "Bank lock", "Locked", "Success", "Fail"];
function App() {
  const [login, setLogin] = useState(false),
    [authScreen, setAuthScreen] = useState("onboarding"),
    [admin, setAdmin] = useState(false),
    [tab, setTab] = useState("home"),
    [orders, setOrders] = useState(seed),
    [records, setRecords] = useState([]),
    [level, setLevel] = useState("L1"),
    [recordType, setRecordType] = useState(null),
    [toast, setToast] = useState(""),
    [balance, setBalance] = useState(1508.72),
    [ledger, setLedger] = useState([
      {
        id: "TXN-2087639",
        type: "Platform Reward",
        amount: 15,
        reason: "Activity reward",
        time: "13 Aug 2026, 02:08 AM",
        balance: 1508.72,
      },
      {
        id: "TXN-2087346",
        type: "Task Reward",
        amount: 6.09,
        reason: "Buy task CP-10598",
        time: "13 Aug 2026, 12:53 AM",
        balance: 1493.72,
      },
      {
        id: "TXN-2086248",
        type: "Level 1 Commission",
        amount: 4.64,
        reason: "Team task commission 0.3%",
        time: "12 Aug 2026, 11:46 PM",
        balance: 1487.63,
      },
    ]),
    [team, setTeam] = useState({ earnings: 81.01, l1: 0, l2: 0, l3: 0 }),
    [mobile, setMobile] = useState("");
  const note = (x) => {
      setToast(x);
      setTimeout(() => setToast(""), 1700);
    },
    receive = (o) => {
      setRecords([
        {
          ...o,
          status: "UNFINISHED",
          time: new Date().toLocaleString("en-IN"),
        },
        ...records,
      ]);
      setOrders(orders.filter((x) => x.id !== o.id));
      note("Order received successfully");
    },
    complete = (id) => {
      const r = records.find((x) => x.id === id);
      if (!r || r.status === "SUCCESS") return;
      setRecords(
        records.map((x) => (x.id === id ? { ...x, status: "SUCCESS" } : x)),
      );
      const a = r.amount * 0.003,
        b = r.amount * 0.002,
        c = r.amount * 0.001;
      setTeam((t) => ({
        ...t,
        earnings: t.earnings + a + b + c,
        l1: t.l1 + a,
        l2: t.l2 + b,
        l3: t.l3 + c,
      }));
      setBalance((v) => v + r.reward);
      setLedger((l) => [
        {
          id: `TXN-${Date.now()}`,
          type: "Task Reward",
          amount: r.reward,
          reason: `Successful task ${r.id}`,
          time: new Date().toLocaleString("en-IN"),
          balance: balance + r.reward,
        },
        ...l,
      ]);
      note("Task complete • Commission credited");
    };
  const enter = (a) => {
    setAdmin(a);
    setLogin(true);
    setTab(a ? "admin" : "home");
  };
  if (!login)
    return (
      <AuthFlow
        screen={authScreen}
        setScreen={setAuthScreen}
        mobile={mobile}
        setMobile={setMobile}
        enter={enter}
      />
    );
  return (
    <div className="app">
      <main>
        {tab === "home" && (
          <Dashboard more={() => setRecordType("Daily Details")} />
        )}{" "}
        {tab === "buy" && (
          <Buy
            orders={orders}
            receive={receive}
            level={level}
            setLevel={setLevel}
            records={() => setRecordType("Buy CP record")}
          />
        )}{" "}
        {tab === "sell" && (
          <Sell records={() => setRecordType("Sell CP record")} />
        )}{" "}
        {tab === "mine" && (
          <Mine
            mobile={mobile}
            balance={balance}
            balanceDetails={() => setRecordType("Balance Details")}
            team={() => setTab("team")}
            logout={() => setLogin(false)}
          />
        )}{" "}
        {tab === "team" && (
          <Team team={team} back={() => setTab("mine")} note={note} />
        )}{" "}
        {tab === "admin" && (
          <Admin
            records={records}
            complete={complete}
            reward={() => {
              const amount = 100;
              setBalance((v) => v + amount);
              setLedger((l) => [
                {
                  id: `PR-${Date.now()}`,
                  type: "Platform Reward",
                  amount,
                  reason: "Manual reward by Admin",
                  time: new Date().toLocaleString("en-IN"),
                  balance: balance + amount,
                },
                ...l,
              ]);
              note("₹100 platform reward added");
            }}
            logout={() => setLogin(false)}
          />
        )}{" "}
        {recordType === "Daily Details" && (
          <DailyDetails
            ledger={ledger}
            records={records}
            back={() => setRecordType(null)}
          />
        )}
        {recordType === "Balance Details" && (
          <BalanceDetails
            ledger={ledger}
            balance={balance}
            back={() => setRecordType(null)}
          />
        )}
        {recordType &&
          !["Daily Details", "Balance Details"].includes(recordType) && (
            <Records
              title={recordType}
              data={records}
              back={() => setRecordType(null)}
            />
          )}
      </main>
      {!["team", "admin"].includes(tab) && (
        <nav>
          <Nav
            icon={Home}
            text="Home"
            active={tab === "home" && !recordType}
            go={() => {
              setRecordType(null);
              setTab("home");
            }}
          />
          <Nav
            coin
            text="Buy CP"
            active={tab === "buy" || recordType === "Buy CP record"}
            go={() => {
              setRecordType(null);
              setTab("buy");
            }}
          />
          <Nav
            icon={WalletCards}
            text="Sell CP"
            active={tab === "sell" || recordType === "Sell CP record"}
            go={() => {
              setRecordType(null);
              setTab("sell");
            }}
          />
          <Nav
            icon={UserRound}
            text="Mine"
            active={tab === "mine" && !recordType}
            go={() => {
              setRecordType(null);
              setTab("mine");
            }}
          />
        </nav>
      )}
      {toast && (
        <div className="toast">
          <CheckCircle2 />
          {toast}
        </div>
      )}
    </div>
  );
}
function AuthFlow({ screen, setScreen, mobile, setMobile, enter }) {
  const [slide, setSlide] = useState(0),
    slides = [
      {
        icon: Zap,
        title: "Fast Payments",
        text: "Complete tasks quickly and securely",
      },
      {
        icon: ShieldCheck,
        title: "Secure Platform",
        text: "Every task and transaction stays protected",
      },
      {
        icon: Smartphone,
        title: "Smart Wallet",
        text: "Manage tasks, rewards and earnings in one place",
      },
    ];
  if (screen === "onboarding") {
    const s = slides[slide],
      Icon = s.icon;
    return (
      <div className="onboarding">
        <div className="onboardBrand">
          <i>CP</i>
          <span>CashbacksPay</span>
        </div>
        <div className="onboardCopy">
          <h1>{s.title}</h1>
          <p>{s.text}</p>
        </div>
        <div className="onboardArt">
          <div className="artHalo" />
          <div className="artPhone">
            <Icon />
          </div>
          <div className="artChip one">₹</div>
          <div className="artChip two">
            <ShieldCheck />
          </div>
        </div>
        <div className="dots">
          {slides.map((_, i) => (
            <i className={slide === i ? "on" : ""} />
          ))}
        </div>
        {slide < 2 ? (
          <button className="onboardNext" onClick={() => setSlide(slide + 1)}>
            Next
          </button>
        ) : (
          <div className="authChoice">
            <button onClick={() => setScreen("register")}>Register</button>
            <button onClick={() => setScreen("login")}>Login</button>
          </div>
        )}
        <button
          className="skip"
          onClick={() => {
            setSlide(2);
          }}
        >
          Skip
        </button>
      </div>
    );
  }
  if (screen === "register")
    return (
      <Register
        back={() => setScreen("onboarding")}
        login={() => setScreen("login")}
        setMobile={setMobile}
      />
    );
  return (
    <Login
      mobile={mobile}
      setMobile={setMobile}
      enter={enter}
      register={() => setScreen("register")}
    />
  );
}
function Register({ back, login, setMobile }) {
  const [f, setF] = useState({
      mobile: "",
      pass: "",
      confirm: "",
      pin: "",
      pin2: "",
      invite: "",
    }),
    [show, setShow] = useState(false),
    [error, setError] = useState("");
  const change = (k, v) => setF({ ...f, [k]: v }),
    submit = () => {
      if (f.mobile.length !== 10)
        return setError("Enter a valid 10-digit mobile number");
      if (f.pass.length < 6)
        return setError("Login password must contain at least 6 characters");
      if (f.pass !== f.confirm) return setError("Login passwords do not match");
      if (!/^\d{6}$/.test(f.pin))
        return setError("Fund PIN must contain exactly 6 digits");
      if (f.pin !== f.pin2) return setError("Fund PINs do not match");
      setMobile(f.mobile);
      login();
    };
  return (
    <div className="registerPage">
      <header>
        <button onClick={back}>
          <ChevronLeft />
        </button>
        <div>
          <small>CREATE ACCOUNT</small>
          <h1>Register</h1>
        </div>
      </header>
      <p>Join CashbacksPay and start completing verified tasks.</p>
      <FormField
        icon={Smartphone}
        placeholder="10-digit mobile number"
        value={f.mobile}
        max={10}
        change={(v) => change("mobile", v.replace(/\D/g, ""))}
      />
      <FormField
        icon={LockKeyhole}
        type={show ? "text" : "password"}
        placeholder="Create login password"
        value={f.pass}
        change={(v) => change("pass", v)}
        action={() => setShow(!show)}
        actionIcon={show ? EyeOff : Eye}
      />
      <FormField
        icon={LockKeyhole}
        type={show ? "text" : "password"}
        placeholder="Confirm login password"
        value={f.confirm}
        change={(v) => change("confirm", v)}
      />
      <FormField
        icon={ShieldCheck}
        type="password"
        placeholder="Create 6-digit Fund PIN"
        value={f.pin}
        max={6}
        change={(v) => change("pin", v.replace(/\D/g, ""))}
      />
      <FormField
        icon={ShieldCheck}
        type="password"
        placeholder="Confirm Fund PIN"
        value={f.pin2}
        max={6}
        change={(v) => change("pin2", v.replace(/\D/g, ""))}
      />
      <FormField
        icon={UsersRound}
        placeholder="Invitation code (optional)"
        value={f.invite}
        max={8}
        change={(v) => change("invite", v.toUpperCase())}
      />
      <label className="terms">
        <input type="checkbox" defaultChecked /> I agree to the Terms and
        Privacy Policy
      </label>
      {error && <div className="formError">{error}</div>}
      <button className="primary" onClick={submit}>
        Create Account
      </button>
      <button className="link" onClick={login}>
        Already registered? Login
      </button>
    </div>
  );
}
function FormField({
  icon: Icon,
  actionIcon: Action,
  action,
  type = "text",
  placeholder,
  value,
  change,
  max,
}) {
  return (
    <div className="regField">
      <Icon />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        maxLength={max}
        onChange={(e) => change(e.target.value)}
      />
      {Action && (
        <button onClick={action}>
          <Action />
        </button>
      )}
    </div>
  );
}
function Login({ mobile, setMobile, enter, register }) {
  return (
    <div className="login">
      <div className="loginGlow">
        <div className="cpLogo">CP</div>
        <h1>CashbacksPay</h1>
        <p>Smart tasks. Instant rewards.</p>
      </div>
      <section>
        <h2>Welcome Back</h2>
        <p>Sign in to continue</p>
        <label>Mobile number</label>
        <div className="phone">
          <span>+91</span>
          <input
            maxLength="10"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter mobile number"
          />
        </div>
        <label>Password</label>
        <input
          className="input"
          type="password"
          placeholder="Enter your password"
        />
        <button
          className="primary"
          onClick={() => enter(mobile === "9999999999")}
        >
          Secure Login
        </button>
        <button className="link" onClick={register}>
          Create new account
        </button>
        <div className="demo">Admin: 9999999999 · User: any number</div>
      </section>
    </div>
  );
}
function Dashboard({ more }) {
  return (
    <>
      <div className="blueHead">
        <div className="topline">
          <div className="miniLogo">CP</div>
          <div>
            <b>CashbacksPay</b>
            <small>Welcome back, Partner</small>
          </div>
          <button>
            <Gift />
          </button>
        </div>
        <div className="campaign">
          <span>DAILY</span>
          <b>REWARD TASKS</b>
          <p>Complete more • Earn more</p>
          <i>UP TO 3% REWARD</i>
          <div className="coins">₹</div>
        </div>
      </div>
      <div className="page homePage">
        <div className="ad">
          <div>
            <small>SECURE DIGITAL PAYMENTS</small>
            <b>Fast Task Settlement</b>
            <span>Verified • Simple • Rewarding</span>
          </div>
          <ShieldCheck />
        </div>
        <section className="overview">
          <Stat icon={ReceiptText} t="Buy quantity" v="12" />
          <Stat icon={WalletCards} t="Buy Amount" v="₹1,288.00" />
          <Stat icon={RefreshCw} t="Sell today" v="₹420.00" />
          <Stat icon={TrendingUp} t="Total revenue" v="₹81.01" />
          <button onClick={more}>
            More <ChevronRight />
          </button>
        </section>
        <h2 className="sectionTitle">Tutorial</h2>
        <section className="tutorial">
          <div>
            <b>Purchase Introduction</b>
            <span>Learn how to receive and finish orders</span>
            <button>
              <PlayCircle /> Watch video
            </button>
          </div>
          <div className="tutorialArt">
            <ReceiptText />
          </div>
        </section>
      </div>
    </>
  );
}
function Stat({ icon: I, t, v }) {
  return (
    <div>
      <span>
        <I />
        {t}
      </span>
      <b>{v}</b>
    </div>
  );
}
function Buy({ orders, receive, level, setLevel, records }) {
  return (
    <>
      <div className="buyHead">
        <div className="levels">
          {["L1", "L2", "L3", "L4", "L5", "L6", "L7"].map((x) => (
            <button
              className={level === x ? "on" : ""}
              onClick={() => setLevel(x)}
            >
              {x}
            </button>
          ))}
          <button onClick={records}>
            <ReceiptText />
          </button>
        </div>
        <div className="filters">
          <button>From low to high⌄</button>
          <button>
            <RefreshCw /> Refresh
          </button>
        </div>
      </div>
      <div className="orderFeed">
        {orders.map((o) => (
          <article>
            <div>
              <h3>Order amount: {cash(o.amount)}</h3>
              <p>Order quantity: {o.qty}</p>
              <p>
                Reward: <b>{cash(o.reward)}</b> <em>+ bonus</em>
              </p>
            </div>
            <div>
              <button onClick={() => receive(o)}>Receive</button>
              <p>
                Final: <b>{cash(o.amount + o.reward)} CP</b>
              </p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
function Sell({ records }) {
  return (
    <div className="page sellPage">
      <section className="today">
        <h3>Today's Overview</h3>
        <span>Amount of receipt:</span>
        <b>₹0.00</b>
        <button onClick={records}>Record</button>
      </section>
      <div className="sellAd">
        <b>Earn more with verified tasks</b>
        <span>Faster matching for active partners</span>
      </div>
      <h2 className="sectionTitle">Wallet Information</h2>
      <section className="emptyWallet">
        <WalletCards />
        <b>There is currently no wallet</b>
        <span>Add your receiving wallet to start selling</span>
      </section>
      <p className="rules">Acceleration rules ⓘ</p>
      <div className="sellBtns">
        <button>
          <PlusCircle /> Add Wallet
        </button>
        <button>
          <TrendingUp /> Sell Faster<small>Available times: 0</small>
        </button>
      </div>
    </div>
  );
}
function Mine({ mobile, balance, balanceDetails, team, logout }) {
  return (
    <div className="page mine">
      <div className="identity">
        <div className="avatar">CP</div>
        <div>
          <b>MOBILE: +91 {mobile || "98XXXXXX10"}</b>
          <button>
            Invite Code: CP123123 <Copy />
          </button>
        </div>
      </div>
      <section className="balance" onClick={balanceDetails} role="button">
        <span>Current Balance</span>
        <b>{cash(balance)}</b>
        <ChevronRight />
      </section>
      <section className="teamBanner" onClick={team}>
        <div>
          <small>MY TEAM</small>
          <b>3-LEVEL Commission</b>
          <span>View earnings →</span>
        </div>
        <UsersRound />
      </section>
      <div className="mineMenu">
        <Menu icon={Gift} text="Newbie Rewards" />
        <Menu icon={WalletCards} text="Payment Accounts" />
        <Menu icon={UsersRound} text="Team Management" click={team} />
        <Menu icon={Headphones} text="Online Service" />
        <Menu icon={LockKeyhole} text="Account Security" />
        <Menu icon={Send} text="Telegram Channel" />
      </div>
      <button className="logout" onClick={logout}>
        <LogOut /> Logout
      </button>
    </div>
  );
}
function Team({ team, back, note }) {
  const [details, setDetails] = useState(false);
  const members = [
    {
      level: 1,
      mobile: "98****3210",
      id: "CP-U10421",
      amount: 3500,
      qty: 5,
      joined: "02 Aug 2026",
      active: true,
    },
    {
      level: 1,
      mobile: "91****8840",
      id: "CP-U10488",
      amount: 4000,
      qty: 2,
      joined: "04 Aug 2026",
      active: true,
    },
    {
      level: 1,
      mobile: "87****9526",
      id: "CP-U10516",
      amount: 1000,
      qty: 2,
      joined: "06 Aug 2026",
      active: false,
    },
    {
      level: 2,
      mobile: "70****4712",
      id: "CP-U10811",
      amount: 2800,
      qty: 3,
      joined: "07 Aug 2026",
      active: true,
    },
    {
      level: 2,
      mobile: "99****1234",
      id: "CP-U10842",
      amount: 1500,
      qty: 1,
      joined: "09 Aug 2026",
      active: false,
    },
    {
      level: 3,
      mobile: "88****7642",
      id: "CP-U11002",
      amount: 5600,
      qty: 7,
      joined: "10 Aug 2026",
      active: true,
    },
  ];
  if (details)
    return <TeamDetails members={members} back={() => setDetails(false)} />;
  return (
    <div className="subpage teamPage">
      <Header title="Team Management" back={back} />
      <section className="teamHero">
        <div className="teamHeroTop">
          <div>
            <small>TOTAL TEAM EARNINGS</small>
            <h1>{cash(team.earnings)}</h1>
          </div>
          <div className="memberCount">
            <UsersRound />
            <span>Team Members</span>
            <b>{members.length}</b>
          </div>
        </div>
        <div className="yesterday">
          <span>
            Yesterday's Commission<b>₹36.09</b>
          </span>
          <span>
            Total Task Amount
            <b>{cash(members.reduce((a, x) => a + x.amount, 0))}</b>
          </span>
        </div>
        <div className="todayRebate">
          <h3>Today's Overview</h3>
          <div>
            <span>
              Commission<b>{cash(team.l1 + team.l2 + team.l3)}</b>
            </span>
            <span>
              Task Amount<b>{cash(8500)}</b>
            </span>
            <span>
              New Members<b>2</b>
            </span>
          </div>
        </div>
      </section>
      <section className="invite teamInvite">
        <div className="sectionHead">
          <h3>Invite & Earn</h3>
          <b>CP123123</b>
        </div>
        <button onClick={() => note("Invite link copied")}>
          cashbackspay.app/invite/CP123123 <Copy />
        </button>
      </section>
      <section className="share teamShare">
        <h3>Share invitation</h3>
        <div>
          <button>
            <Send />
            Telegram
          </button>
          <button>
            <Share2 />
            WhatsApp
          </button>
          <button>
            <ReceiptText />
            QR Code
          </button>
          <button>
            <Copy />
            Copy
          </button>
        </div>
      </section>
      <section className="rewardCard">
        <div className="sectionHead">
          <div>
            <small>AUTOMATIC COMMISSION</small>
            <h3>Purchase Reward</h3>
          </div>
          <button onClick={() => setDetails(true)}>
            Details <ChevronRight />
          </button>
        </div>
        <div className="rewardTable">
          <div className="tableHeader">
            <b>Level</b>
            <b>Rate</b>
            <b>Members</b>
            <b>Active</b>
          </div>
          {[1, 2, 3].map((l) => {
            const list = members.filter((x) => x.level === l);
            return (
              <div>
                <span>L{l}</span>
                <strong>{[0.3, 0.2, 0.1][l - 1]}%</strong>
                <span>{list.length}</span>
                <span>{list.filter((x) => x.active).length}</span>
              </div>
            );
          })}
        </div>
        <p>Commission is credited automatically after successful team tasks.</p>
      </section>
      <section className="levelCards">
        {[1, 2, 3].map((l) => (
          <button onClick={() => setDetails(true)}>
            <i>L{l}</i>
            <span>
              {members.filter((x) => x.level === l).length} Members
              <small>{[0.3, 0.2, 0.1][l - 1]}% Commission</small>
            </span>
            <ChevronRight />
          </button>
        ))}
      </section>
    </div>
  );
}
function TeamDetails({ members, back }) {
  const [level, setLevel] = useState(1),
    [query, setQuery] = useState(""),
    rate = { 1: 0.003, 2: 0.002, 3: 0.001 },
    shown = members.filter(
      (x) =>
        x.level === level &&
        (x.mobile + x.id).toLowerCase().includes(query.toLowerCase()),
    ),
    amount = shown.reduce((a, x) => a + x.amount, 0);
  return (
    <div className="teamDetailPage">
      <Header title="Team Task Details" back={back} />
      <div className="detailLevelTabs">
        {[1, 2, 3].map((x) => (
          <button
            className={level === x ? "on" : ""}
            onClick={() => setLevel(x)}
          >
            Level {x}
            <small>{[0.3, 0.2, 0.1][x - 1]}%</small>
          </button>
        ))}
      </div>
      <div className="memberSearch">
        <Search />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search user ID or mobile"
        />
      </div>
      <section className="levelSummary">
        <div>
          <span>Members</span>
          <b>{shown.length}</b>
        </div>
        <div>
          <span>Task Amount</span>
          <b>{cash(amount)}</b>
        </div>
        <div>
          <span>Your Bonus</span>
          <b>{cash(amount * rate[level])}</b>
        </div>
      </section>
      <div className="memberList">
        {shown.map((x) => (
          <article>
            <div className="memberAvatar">{x.mobile.slice(0, 2)}</div>
            <div className="memberIdentity">
              <b>{x.mobile}</b>
              <span>
                {x.id} · Joined {x.joined}
              </span>
              <small className={x.active ? "online" : "offline"}>
                {x.active ? "● Active today" : "● Inactive"}
              </small>
            </div>
            <div className="memberBonus">
              <strong>{cash(x.amount * rate[level])}</strong>
              <span>{x.qty} tasks</span>
            </div>
            <div className="memberStats">
              <span>
                Successful Task Amount<b>{cash(x.amount)}</b>
              </span>
              <span>
                Commission Rate<b>{rate[level] * 100}%</b>
              </span>
              <span>
                Bonus Earned<b>{cash(x.amount * rate[level])}</b>
              </span>
            </div>
          </article>
        ))}
        {!shown.length && <Empty />}
      </div>
    </div>
  );
}
function Records({ title, data, back }) {
  const [filter, setFilter] = useState("Unfinished"),
    key =
      filter === "Unfinished"
        ? "UNFINISHED"
        : filter === "Success"
          ? "SUCCESS"
          : filter === "Fail"
            ? "FAILED"
            : filter.toUpperCase(),
    shown = data.filter((x) => x.status === key);
  return (
    <div className="overlayPage">
      <Header title={title} back={back} />
      <div className="recordTabs">
        {tabs.map((x) => (
          <button
            className={filter === x ? "on" : ""}
            onClick={() => setFilter(x)}
          >
            {x}
          </button>
        ))}
      </div>
      {shown.length ? (
        <div className="recordList">
          {shown.map((x) => (
            <article>
              <b>{x.id}</b>
              <span>{cash(x.amount)}</span>
              <small>{x.time}</small>
              <Status s={x.status} />
            </article>
          ))}
        </div>
      ) : (
        <Empty />
      )}
    </div>
  );
}
function Admin({ records, complete, reward, logout }) {
  return (
    <div className="subpage admin">
      <div className="adminTitle">
        <div>
          <small>CashbacksPay</small>
          <h2>Task Control</h2>
        </div>
        <button onClick={logout}>
          <LogOut />
        </button>
      </div>
      <div className="adminStats">
        <span>
          Active Orders
          <b>{records.filter((x) => x.status === "UNFINISHED").length}</b>
        </span>
        <span>
          Completed<b>{records.filter((x) => x.status === "SUCCESS").length}</b>
        </span>
      </div>
      <button className="platformReward" onClick={reward}>
        <Gift /> Add ₹100 Platform Reward
      </button>
      <h3>Task Queue</h3>
      {records.length ? (
        records.map((x) => (
          <article>
            <div>
              <b>{x.id}</b>
              <small>{x.time}</small>
              <span>{cash(x.amount)}</span>
            </div>
            <Status s={x.status} />
            {x.status === "UNFINISHED" && (
              <button onClick={() => complete(x.id)}>
                Mark task successful
              </button>
            )}
          </article>
        ))
      ) : (
        <Empty />
      )}
      <p className="adminNote">
        Successful task automatically distributes 0.3%, 0.2% and 0.1% referral
        commission. No separate commission approval.
      </p>
    </div>
  );
}
function DailyDetails({ ledger, records, back }) {
  const credits = ledger.filter((x) => x.amount > 0),
    total = credits.reduce((a, x) => a + x.amount, 0),
    successful = records.filter((x) => x.status === "SUCCESS");
  return (
    <div className="overlayPage detailPage">
      <Header title="Daily Details" back={back} />
      <div className="datePill">
        <CalendarDays /> 13 August 2026
      </div>
      <section className="incomeHero">
        <small>TODAY'S TOTAL INCOME</small>
        <b>{cash(total)}</b>
        <span>Updated from your activity ledger</span>
      </section>
      <h3>Purchase Data</h3>
      <section className="metricGrid">
        <Metric t="Tasks" v={successful.length} />
        <Metric
          t="Amount"
          v={cash(successful.reduce((a, x) => a + x.amount, 0))}
        />
        <Metric
          t="Task Rewards"
          v={cash(
            ledger
              .filter((x) => x.type === "Task Reward")
              .reduce((a, x) => a + x.amount, 0),
          )}
        />
        <Metric
          t="Team Rebates"
          v={cash(
            ledger
              .filter((x) => x.type.includes("Commission"))
              .reduce((a, x) => a + x.amount, 0),
          )}
        />
      </section>
      <h3>Data for Sale</h3>
      <section className="metricGrid">
        <Metric t="Successful Sales" v="0" />
        <Metric t="Sell Amount" v="₹0.00" />
      </section>
      <h3>Platform Rewards</h3>
      <section className="rewardSummary">
        <Gift />
        <div>
          <b>
            {cash(
              ledger
                .filter((x) => x.type === "Platform Reward")
                .reduce((a, x) => a + x.amount, 0),
            )}
          </b>
          <span>Activity, bonus and manual admin rewards</span>
        </div>
      </section>
    </div>
  );
}
function Metric({ t, v }) {
  return (
    <div>
      <span>{t}</span>
      <b>{v}</b>
    </div>
  );
}
function BalanceDetails({ ledger, balance, back }) {
  const [q, setQ] = useState(""),
    [kind, setKind] = useState("All"),
    shown = ledger.filter(
      (x) =>
        (x.id + x.type + x.reason).toLowerCase().includes(q.toLowerCase()) &&
        (kind === "All" || (kind === "Credit" ? x.amount > 0 : x.amount < 0)),
    );
  return (
    <div className="overlayPage balancePage">
      <Header title="Balance Details" back={back} />
      <section className="ledgerBalance">
        <small>AVAILABLE BALANCE</small>
        <b>{cash(balance)}</b>
      </section>
      <div className="ledgerTools">
        <div>
          <Search />
          <input
            placeholder="Search ID, task or reason"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <button>
          <CalendarDays />
        </button>
      </div>
      <div className="ledgerFilters">
        {["All", "Credit", "Debit"].map((x) => (
          <button className={kind === x ? "on" : ""} onClick={() => setKind(x)}>
            {x}
          </button>
        ))}
      </div>
      <div className="ledgerList">
        {shown.map((x) => (
          <article>
            <div className={x.amount >= 0 ? "creditIcon" : "debitIcon"}>
              {x.amount >= 0 ? <ArrowDownCircle /> : <ArrowUpCircle />}
            </div>
            <div>
              <b>{x.type}</b>
              <span>{x.reason}</span>
              <small>
                {x.id} · {x.time}
              </small>
            </div>
            <div>
              <strong className={x.amount >= 0 ? "creditText" : "debitText"}>
                {x.amount >= 0 ? "+" : "-"}
                {cash(Math.abs(x.amount))}
              </strong>
              <small>Bal. {cash(x.balance)}</small>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
function Header({ title, back }) {
  return (
    <header className="header">
      <button onClick={back}>
        <ChevronLeft />
      </button>
      <b>{title}</b>
      <i />
    </header>
  );
}
function Empty() {
  return (
    <div className="empty">
      <div>
        <ReceiptText />
      </div>
      <b>There are currently no orders</b>
      <span>Your matching orders will appear here</span>
    </div>
  );
}
function Status({ s }) {
  return (
    <span className={"status " + s.toLowerCase()}>
      {s === "SUCCESS" ? (
        <CheckCircle2 />
      ) : s === "FAILED" ? (
        <XCircle />
      ) : (
        <Clock3 />
      )}
      {s}
    </span>
  );
}
function Menu({ icon: I, text, click }) {
  return (
    <button onClick={click}>
      <I />
      <span>{text}</span>
      <ChevronRight />
    </button>
  );
}
function Nav({ icon: I, coin, text, active, go }) {
  return (
    <button className={active ? "active" : ""} onClick={go}>
      {coin ? <i>CP</i> : <I />}
      <span>{text}</span>
    </button>
  );
}
createRoot(document.getElementById("root")).render(<App />);
