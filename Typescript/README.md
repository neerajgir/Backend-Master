# ☕ TypeScript Learning Repo — Zero se Hero tak (Hinglish Edition)

> Ye mera personal TypeScript learning repo hai. Yahan main basics se lekar advanced concepts tak sab kuch practice karta hoon — code snippets, deep knowledge, diagrams aur real-life examples ke saath. Sab kuch **Hinglish** mein, taaki concepts dimaag mein chipke! 🧠

---

## 📂 Repo Structure

```
Typescript/
├── basics/           → Variables, types, exercises
├── intermediate/     → Objects, functions, arrays, tuples, enums
├── advance/          → Generics, interfaces, fetch/web requests
├── types/            → Union, any, type narrowing, interfaces
├── OOP/              → Classes, inheritance, access modifiers
├── react/            → TypeScript with React (Vite app)
├── index.ts          → Entry point
└── tsconfig.json     → TS configuration
```

**Run karne ke liye:**
```bash
bun install
bun run dev       # watch mode mein chalta rahega
bun run start     # ek baar run karega
```

---

## 🤔 TypeScript Kya Hai? (Intro)

Simple bhasha mein: **TypeScript = JavaScript + Types**

JavaScript ek *dynamically typed* language hai. Matlab:

```ts
// JavaScript - ye allowed hai (aur bug ka guarantee hai 😅)
let price = 100;
price = "free kardo bhai";   // JS: "koi problem nahi!"
price.toFixed(2);            // 💥 Runtime crash: toFixed is not a function
```

Ye error app **chalti hui** (runtime pe) milega — matlab user ko dikh chuka hoga. TypeScript yahan game change kar deta hai:

```ts
// TypeScript - compile time pe hi pakad lega
let price: number = 100;
price = "free kardo bhai";  // ❌ Error: Type 'string' is not assignable to type 'number'
```

### Key Insight 💡
> TypeScript **runtime pe exist hi nahi karta**. Ye sirf ek **development-time layer** hai. TS code → compile → pure JavaScript. Browser/sir Node ko TS ki parwah nahi, wo sirf JS dekhta hai.

```
    .ts file                    .js file                   Browser
┌──────────────┐    TSC     ┌──────────────┐
│ TypeScript   │ ────────▶  │  JavaScript  │ ────────▶  chal gaya!
│ (types + js) │  compiler  │ (types gaye) │
└──────────────┘            └──────────────┘
      ▲
      │  Errors YAHAN milte hain (compile time)
      │  = code chalane se PEHLE hi pata chal gaya
```

**Analogy:** JS mein coding karna aisa hai jaise bina helmet bike chalana — jab tak accident nahi hota, sab theek lagta hai. TS helmet hai — *pehle se* bachata hai. 🪖

### TypeScript kyun? (Real fayde)

| Problem (JS) | Solution (TS) |
|---|---|
| Typo: `usr.name` vs `user.name` | Compile time pe error |
| Function ko galat type ka argument | Autocomplete + error |
| API se kya aayega, koi idea nahi | Interfaces/types se shape define |
| Refactor = darr | Rename safely, TS sab jagah check karega |
| Team collab confusion | Types = built-in documentation |

---

## 📝 Basics

### Variables aur Types

```ts
let name: string = "Neeraj";
let age: number = 21;
let isDev: boolean = true;

// Type inference - TS khud guess kar leta hai
let city = "Delhi";        // TS: "ye string hai" (explicit likhne ki zaroorat nahi)
// city = 42;              // ❌ Error - inference ke baad bhi lock ho gaya
```

**Deep point:** Type inference sirf **initialization** pe hota hai. Agar variable declare karke value baad mein do:

```ts
let score;        // TS: any (implicitly!) - yahan dhyan dena
score = 10;       // OK
score = "high";   // OK - kyunki type hi any hai 😬
```

### Objects

```ts
const user: { name: string; age: number } = {
  name: "Neeraj",
  age: 21,
};

// Optional properties (?)
const order: { id: number; coupon?: string } = { id: 1 };

// Readonly - change nahi kar sakte
const config: { readonly port: number } = { port: 3000 };
// config.port = 8080;  ❌ Cannot assign to 'port' because it is read-only
```

### Functions

```ts
// (param: type) => returnType
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function version
const multiply = (a: number, b: number): number => a * b;

// Default params + optional params
function greet(name: string = "guest", greeting?: string) {
  return `${greeting ?? "Hello"}, ${name}!`;
}

// void = kuch return nahi karta
function log(msg: string): void {
  console.log(msg);
}

// never = function kabhi END nahi hoga (throw ya infinite loop)
function fail(msg: string): never {
  throw new Error(msg);
}
```

**`void` vs `never` (interview favourite):**
- `void` → function return kuch nahi karta, lekin **normally khatam** hota hai.
- `never` → function **kabhi khatam hi nahi hota** (throw / infinite loop). TS ke type-system mein `never` bottom type hai — koi bhi value `never` nahi ho sakti.

### Arrays & Tuples & Enums

```ts
// Arrays
let nums: number[] = [1, 2, 3];
let rows: string[][] = [["a", "b"]];    // 2D array

// Union type array
let mixed: (string | number)[] = [1, "chai", 2];

// Tuple - FIXED length + FIXED order (array se strict!)
let chaiOrder: [string, number] = ["Masala", 20];
// chaiOrder = [20, "Masala"];  ❌ order galat hai

// Enums - named constants
enum Status {
  Pending,      // 0
  Shipped,      // 1
  Delivered,    // 2
}
let s: Status = Status.Shipped;   // readable code!

// String enum (production mein zyada use hota hai)
enum LogLevel {
  Info = "INFO",
  Error = "ERROR",
}
```

**Real-life tuple usage:** `Object.entries(user)` → `[string, unknown][]` tuples return karta hai. React ke `useState` bhi tuple hi return karta hai: `const [count, setCount] = useState(0)` — pehla item value, doosra setter. Fixed structure guaranteed!

---

## 🔀 Types Folder — Union, Narrowing & Interfaces

### Union Types (`|`)

```ts
type Id = string | number;

function printId(id: Id) {
  console.log(id.toUpperCase());  // ❌ number pe toUpperCase exist nahi karta!
}
```

Yahi union ka **core rule** hai: jab tak TS nahi jaanta value kaunsi type ki hai, sirf **common properties** use kar sakte ho.

### Type Narrowing — TS ko batana "ab batao kya hai"

```ts
function printId(id: string | number) {
  // Narrowing technique #1: typeof check
  if (typeof id === "string") {
    console.log(id.toUpperCase());   // ✅ ab TS ko pata hai ye string hai
  } else {
    console.log(id.toFixed(2));      // ✅ yahan pakka number hai
  }
}

// Technique #2: "in" operator (objects ke liye)
type Bird = { fly: () => void };
type Fish = { swim: () => void };

function move(animal: Bird | Fish) {
  if ("swim" in animal) animal.swim();
  else animal.fly();
}

// Technique #3: equality narrowing
function format(value: string | number | boolean) {
  if (typeof value === "string" || typeof value === "number") {
    return value.toString();  // ✅ dono cases mein toString hai
  }
}
```

### Discriminated Unions (Production pattern 🔥)

```ts
// Har variant mein ek "tag" hota hai - isse narrowing super clean hoti hai
type RequestState =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; message: string };

function render(state: RequestState) {
  switch (state.status) {
    case "loading":
      return "Spinner dikhao...";
    case "success":
      return state.data.join(", ");   // ✅ sirf success mein data exist karta hai
    case "error":
      return state.message;           // ✅ sirf error mein message hai
  }
}
```

**Real-life:** Redux, React Query, API states — sab jagah ye pattern hai. Ye TS ka **sabse powerful** feature hai real apps ke liye.

### `any` vs `unknown` vs `never` — Triple Comparison

```ts
let a: any = 10;
a.toUpperCase();        // ✅ TS kuch nahi bolega (danger! runtime crash possible)

let u: unknown = 10;
// u.toUpperCase();     // ❌ Error - pehle CHECK karo kya hai
if (typeof u === "string") u.toUpperCase();  // ✅ ab allowed

let n: never;           // kuch bhi assign nahi kar sakte
```

**Diagram:**

```
        any  ◀─── "type-checker band kardo" (UNSAFE)
         ▲
         │  unknown = "kuch bhi ho sakta hai, PEHLE check karo" (SAFE any)
         ▲
 string ─┼─ number ─┼─ boolean ... (normal types)
         ▲
       never ◀─── "kabhi possible hi nahi" (bottom type)
```

**Rule of thumb:** `any` ko sirf emergency mein use karo. Default `unknown` rakhо jab type pata nahi.

### Interfaces

```ts
interface Chai {
  flavour: string;
  price: number;
  description?: string;          // optional
  readonly id: number;           // sirf read
  brew?(): string;               // method (optional)
}

const masala: Chai = {
  id: 1,
  flavour: "Masala",
  price: 20,
  brew: () => "brewing...",
};

// Interface EXTEND hota hai (inheritance)
interface PremiumChai extends Chai {
  servedIn: "cup" | "kulhad";
}

// Declaration merging - same naam ke interfaces MERGE ho jate hain!
interface Window { title: string }
interface Window { ts: string }
// Ab Window mein dono properties hain 🤯
```

### `interface` vs `type` — Kab kya use karein?

| Feature | `interface` | `type` |
|---|---|---|
| Object shape | ✅ Best | ✅ |
| Union `\|` / Intersection `&` | ❌ | ✅ |
| Primitives map karna (`type Id = string`) | ❌ | ✅ |
| Declaration merging | ✅ | ❌ |
| Extends/extends chain | ✅ clean | ✅ (via `&`) |

> Interview answer: **Functional difference chhota hai.** Objects ke liye `interface` (extension + merging), unions/computed types ke liye `type`. Consistency > koi ek "sahi" choice.

---

## 🏗️ Intermediate — Functions & Objects (Advanced)

### Function Types & Overloads

```ts
// Function ko type dena
type MathOp = (a: number, b: number) => number;
const divide: MathOp = (a, b) => a / b;

// Optional & rest params
function sum(...nums: number[]): number {
  return nums.reduce((acc, n) => acc + n, 0);
}

// Function Overloads - ek function, multiple signatures
function createDate(timestamp: number): Date;
function createDate(year: number, month: number, day: number): Date;
function createDate(a: number, b?: number, c?: number): Date {
  return b !== undefined && c !== undefined
    ? new Date(a, b - 1, c)
    : new Date(a);
}

createDate(1693000000000);      // ✅
createDate(2024, 8, 30);        // ✅
```

**Real-life:** DOM events — `addEventListener("click", cb)` vs `addEventListener("scroll", cb)` — event type automatically narrow hota hai, ye overloads ki wajah se hota hai.

### `this` aur strictness

```ts
class Counter {
  count = 0;
  increment = () => {        // arrow function = 'this' bind rahega
    this.count++;
  };
}
```

---

## 🧬 Advanced — Generics (TS ka Superpower)

**Problem:** Ek function likhna hai jo **kisi bhi type** ke saath kaam kare, **lekin type info kho ye nahi**.

```ts
// ❌ Solution 1: any - type info GAYAB
function wrapInArrAny(item: any): any[] {
  return [item];
}
const r = wrapInArrAny("chai");  // r: any[] - autocomplete kuch nahi milega

// ✅ Solution 2: GENERIC - type ka "placeholder"
function wrapInArr<T>(item: T): T[] {
  return [item];
}
const s = wrapInArr("Masala");   // s: string[] ✅ TS ne khud T = string samjha
const n = wrapInArr(33);         // n: number[]
const o = wrapInArr({ flavour: "Ginger" });  // o: { flavour: string }[]
```

**Analogy:** Generic ek **tiffin box** hai — dabba same rahega, andar kya rakha hai wo *aap decide karte ho*. `<T>` wahi dabba hai jo kisi bhi "type" ke saath kaam karta hai. 🍱

### Multiple Type Params

```ts
function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}
pair("masala", 20);                    // [string, number]
pair("masala", { flavour: "Ginger" }); // [string, { flavour: string }]
```

### Generic Interfaces & Constraints

```ts
interface Box<T> {
  content: T;
}
const numBox: Box<number> = { content: 10 };
const strBox: Box<string> = { content: "10" };

// Constraint - T ko LIMIT karna (extends se)
interface HasLength { length: number }

function logLength<T extends HasLength>(item: T): T {
  console.log(item.length);   // ✅ pakka 'length' hoga
  return item;
}
logLength("chai");        // ✅ string.length hai
logLength([1, 2, 3]);     // ✅ array.length hai
// logLength(10);         ❌ number pe .length nahi
```

### Real World — API Response Typing

```ts
interface ApiPromise<T> {
  status: number;
  data: T;
}

const res: ApiPromise<{ flavour: string }> = {
  status: 200,
  data: { flavour: "masala" },
};
res.data.flavour;  // ✅ full autocomplete!
```

```ts
// Ek generic fetcher - POORE app mein reuse
async function fetchData<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

// Usage - har API ke liye alag type, zero duplication
const user = await fetchData<User>("/api/user/1");
const chaiList = await fetchData<Chai[]>("/api/chais");
```

**Real-life generics jo tum already use kar rahe ho (bina jaane):**
- `Promise<T>` — network response
- `Array<T>` — har array
- `useState<string>("hi")` — React hook
- `Record<K, V>` — key-value maps

```
     Generic Flow
┌─────────────────────────────────────┐
│  fetchData<T>(url): Promise<T>      │
│       ▲                  ▲          │
│       │                  │          │
│   T = User          T = Chai[]      │
│       │                  │          │
│  {id,name,          [{flavour,      │
│   email...}          price...}]     │
└─────────────────────────────────────┘
   EK function → SAARE types → Full type safety
```

---

## 🏛️ OOP — Classes (Object Oriented TypeScript)

### Class Basics + Access Modifiers

```ts
class ChaiNew {
  public flavour: string = "Masala";   // sab jagah accessible
  private secretIng = "Cardamom";      // SIRF class ke andar

  reveal() {
    return this.secretIng;             // ✅ andar se OK
  }
}

const chai = new ChaiNew();
console.log(chai.flavour);      // ✅ "Masala"
// console.log(chai.secretIng); ❌ Error: private hai
```

| Modifier | Class ke andar | Subclass | Bahar |
|---|---|---|---|
| `public` (default) | ✅ | ✅ | ✅ |
| `protected` | ✅ | ✅ | ❌ |
| `private` | ✅ | ❌ | ❌ |

```
      Access Modifiers Visual
┌─────────────────────────────────────┐
│  class ChaiNew                      │
│  ┌───────────────────────────────┐  │
│  │ private secretIng   ← sirf    │  │
│  │                       yahan   │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │ protected (subclass OK) │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
│  public flavour  ← kahin bhi ✅     │
└─────────────────────────────────────┘
```

### Inheritance & `protected`

```ts
class ShopName {
  protected shopName = "Chai Corner";  // subclass access kar sakti hai
}

class Branch extends ShopName {
  getName() {
    return this.shopName;   // ✅ protected = family ke liye accessible
  }
}
```

### Private Fields (`#`) vs `private`

```ts
class Wallet {
  #balance = 100;              // TRUE JS privacy - runtime pe bhi hidden
  getBalance() {
    return this.#balance;
  }
}
// TS ka 'private' sirf compile-time hai; '#' runtime pe bhi enforce hota hai.
```

### Getters & Setters

```ts
class ModernChai {
  private _sugar = 2;

  get sugar() { return this._sugar; }         // padhne ka tareeka
  set sugar(value: number) {                  // likhne ka control
    if (value > 5) throw new Error("Too Much Sugar");
    this._sugar = value;
  }
}

const c = new ModernChai();
c.sugar = 3;   // setter chala - validation ke saath
```

**Real-life:** Form state, game settings, config limits — jahan bhi **invalid values se bachna** hai.

### Static, Parameter Properties & Abstract

```ts
class EkChai {
  static shopName = "Chaicode Cafe";     // class pe, instance pe NAHI
  constructor(public flavour: string) {} // param property = auto this.flavour
}
console.log(EkChai.shopName);            // class se access

// Abstract class = "blueprint" - direct instantiate NAHI kar sakte
abstract class Drink {
  abstract make(): void;   // subclass ko YE method likhna PADEGA
}
class MyChai extends Drink {
  make() { console.log("Brewing Chai"); }  // contract fulfill ✅
}
// new Drink();  ❌ Cannot create instance of abstract class
```

### Composition > Inheritance (Pro tip 💡)

```ts
class Heater { heat() {} }

// ChaiMaker ko Heater "diya" gaya hai (HAS-A), "hai" (IS-A) nahi
class ChaiMaker {
  constructor(private heater: Heater) {}
  make() { this.heater.heat(); }
}
```

> Deep design principle: **"Favor composition over inheritance"**. Inheritance fragile hoti hai (parent change → saare children toote). Composition flexible hai. Ye pattern Dependency Injection frameworks (NestJS, Angular) ka base hai.

---

## ⚡ Utility Types — Ready-made Superpowers

```ts
interface User { id: number; name: string; email: string; password: string }

// Partial - saari properties optional (update forms ke liye perfect)
function updateUser(id: number, changes: Partial<User>) {}
updateUser(1, { name: "New Name" });  // ✅ baaki fields nahi chahiye

// Pick - sirf kuch chuno
type PublicUser = Pick<User, "id" | "name">;

// Omit - kuch hatao (password kabhi client ko mat bhejo!)
type SafeUser = Omit<User, "password">;

// Record - key-value type
type ChaiPrices = Record<string, number>;
const menu: ChaiPrices = { masala: 20, ginger: 25 };

// Readonly - koi mutation nahi
const config: Readonly<{ port: number }> = { port: 3000 };

// ReturnType - function ke return ka type auto-nikalo
function getChai() { return { flavour: "masala", price: 20 }; }
type Chai = ReturnType<typeof getChai>;  // { flavour: string; price: number }
```

**Real-life gold:** `Omit<User, "password">` — API response se password hide karna. Ye chhota sa pattern security bugs se bachata hai.

---

## 🌐 Real-Life Usage — API Requests (advance/ folder)

### Fetch + Interfaces

```ts
interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

async function getTodo(): Promise<Todo> {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  return res.json();  // TS ko trust karna padta hai - runtime check nahi hota
}

getTodo().then((t) => console.log(t.title));  // ✅ typed autocomplete
```

### Axios ke saath

```ts
import axios from "axios";

// Generic response - axios already generic hai!
const { data } = await axios.get<Todo>("/todos/1");
data.completed;  // ✅ boolean, fully typed
```

**⚠️ Deep knowledge alert:** `res.json()` ka return type `Promise<any>` hai. TS **runtime pe data validate nahi karta** — API agar alag shape bheje, TS ko pata hi nahi chalega. Isliye production apps **zod / valibot** jaise runtime validation libraries use karti hain:

```ts
import { z } from "zod";

const TodoSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
});

const todo = TodoSchema.parse(await res.json());  // runtime pe VERIFY hua
type Todo = z.infer<typeof TodoSchema>;           // type bhi auto-generate!
```

---

## ⚛️ TypeScript + React (react/ folder)

```tsx
// Props typing
interface ChaiCardProps {
  name: string;
  price: number;
  spicy?: boolean;
}

function ChaiCard({ name, price, spicy = false }: ChaiCardProps) {
  return <div>{name} - ₹{price} {spicy && "🌶️"}</div>;
}

// useState generic
const [chai, setChai] = useState<Chai | null>(null);   // API data
const [count, setCount] = useState(0);                  // inference se number

// Events
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { /* ... */ };

// useFetch hook - custom generic hook
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  // ... fetch logic
  return { data, loading };  // har API ke liye reusable!
}
```

**Real-life pattern:** `data | null` union + `loading` state = **har async UI ka skeleton**. TS aapko force karega ki `null` case handle karo — isse "Cannot read property of undefined" bugs khatam.

---

## 🧠 Deep Knowledge Nuggets (Interview Gems)

### 1. Structural Typing — TS "naam" nahi, "shape" dekhta hai

```ts
interface Point { x: number; y: number }
interface Coord { x: number; y: number }

const p: Point = { x: 1, y: 2 };
const c: Coord = p;   // ✅ NO ERROR! Shape same hai, naam irrelevant
```

Java/C# **nominal** typing use karte hain (naam match hona chahiye). TS **structural** hai — duck typing: "agar quack jaisa dikhta hai, to duck hai" 🦆. Isi wajah se TS flexible hai.

### 2. Type Assertion vs Type Casting

```ts
const canvas = document.getElementById("main") as HTMLCanvasElement;
// Aap TS ko bol rahe ho: "Mujhe pata hai ye kya hai - mujh pe bharosa karo"
// ⚠️ Assertion koi conversion nahi karta - sirf checker ko chup karta hai
```

### 3. `as const` — Literal types freeze

```ts
const config = { endpoint: "/api", port: 3000 } as const;
// config.port ka type: 3000 (sirf ye value!) - number nahi
// Saari properties readonly
```

### 4. Satisfies Operator (TS 4.9+)

```ts
type Config = { port: number; host: string };

const config = {
  port: 3000,
  host: "localhost",
  extra: true,        // ✅ with 'satisfies', extra props ALLOWED
} satisfies Config;
// Validation + inference, dono milte hain. Best of both worlds!
```

### 5. tsconfig samajhna zaroori hai

```jsonc
{
  "compilerOptions": {
    "target": "ES2020",       // kis JS version mein compile ho
    "module": "ESNext",       // import/export style
    "strict": true,           // ⭐ SABSE important - full type checking
    "noImplicitAny": true,    // chhupi hui 'any' pe error
    "strictNullChecks": true  // null/undefined handle karna PADEGA
  }
}
```

> **`strict: true` hamesha.** Interview mein agar pucha "strictNullChecks kya hai" — bolo: *"TS ko majboor karta hai ki null/undefined possible cases explicitly handle karo, jo billion-dollar mistake (null reference errors) se bachata hai."*

---

## 🗺️ Learning Roadmap (Meri Journey)

```
   basics/          intermediate/         advance/           OOP/
┌───────────┐    ┌──────────────┐    ┌─────────────┐   ┌────────────┐
│ variables │    │   objects    │    │  generics   │   │  classes   │
│  types    │ →  │  functions   │ →  │ interfaces  │ → │ modifiers  │
│ exercises │    │ arrays/tuple │    │  fetch/API  │   │ abstract   │
│           │    │    enums     │    │             │   │ static     │
└───────────┘    └──────────────┘    └─────────────┘   └────────────┘
                                                    ↓
                                              react/ (TS + React)
```

---

## 📌 Cheat Sheet — Ek Nazar Mein

| Concept | Syntax | Kab use karein |
|---|---|---|
| Union | `string \| number` | Multiple possible types |
| Narrowing | `typeof x === "string"` | Union handle karne ke liye |
| Interface | `interface User { ... }` | Object shapes |
| Type alias | `type Id = string` | Unions, primitives, computed |
| Generic | `function f<T>(x: T): T` | Reusable + type-safe code |
| Optional | `prop?: string` | Ho sakta hai ho, ho sakta hai na ho |
| Readonly | `readonly id: number` | Immutable data |
| Unknown | `let x: unknown` | any ka safe version |
| `as const` | `{ a: 1 } as const` | Literal freeze + readonly |
| Utility | `Partial<T>`, `Omit<T, K>` | Transform existing types |

---

## 🚀 Aage Kya? (Next Steps)

- [ ] Zod ke saath runtime validation
- [ ] Discriminated unions aur deep practice
- [ ] Mapped types & conditional types (`T extends U ? X : Y`)
- [ ] Decorators (NestJS ka base)
- [ ] TS in Node.js/Express backend (main goal — Backend Master! 💪)

---

> **Note:** Ye repo Bun runtime use karta hai (`bun --watch index.ts`). Har concept ko **khud type karke** run karo — reading se 20% samajh aata hai, doing se 80%. Happy coding! ☕🔥
