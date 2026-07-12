
# Abstraction in TypeScript (Interview Questions & Answers)

## Q- What is Abstraction?

**Ans-**

Abstraction is the process of hiding implementation details and exposing only the essential functionality to the user.

In simple words, users know **what a method does**, but they don't need to know **how it is implemented**.

### Playwright Framework Example

Suppose our `BasePage` has a method:

```typescript
loginPage.navigate("/login");
```

The test simply calls this method.

Internally, the method may:

- Navigate to the URL
- Wait for page load
- Wait for network idle
- Verify the page is opened

The test doesn't know these implementation details—it only knows that calling `navigate()` opens the page.

Similarly,

```typescript
loginPage.login();
loginPage.isAt();
```

The test doesn't know how login is performed or how page validation is implemented.

This is **Abstraction**.

---

## Q- How can we achieve Abstraction in TypeScript?

**Ans-**

TypeScript provides two ways to achieve abstraction:

1. **Abstract Classes** ✅ (Most commonly used)
2. **Interfaces** ✅

- **Abstract classes** provide **partial abstraction** because they can contain both implemented methods and abstract methods.
- **Interfaces** provide **complete abstraction** because they only define a contract (method/property declarations) without implementation.

---

# Interfaces

## Q- What is an Interface?

**Ans-**

An interface is a contract that defines what properties and methods a class must implement.

It only specifies **what should exist**, not **how it should be implemented**.

Example:

```typescript
interface ILogger {

    log(message: string): void;
}

class ConsoleLogger implements ILogger {

    log(message: string): void {
        console.log(message);
    }
}
```

---

## Q- What can an Interface contain?

**Ans-**

An interface can contain:

- Property declarations
- Method declarations
- Optional properties (`?`)
- Readonly properties

It **cannot contain method implementations, constructors, or initialized properties**.

Example:

```typescript
interface Employee {

    readonly id: number;
    name: string;

    display(): void;
}
```

---

## Q- Can an interface have initialized properties?

**Ans-**

No.

Interfaces only declare properties.

They cannot assign values.

❌ Invalid

```typescript
interface Employee {

    name: string = "Prince";
}
```

✅ Correct

```typescript
interface Employee {

    name: string;
}
```

The implementing class initializes the property.

---

## Q- Why do we use Interfaces?

**Ans-**

We use interfaces to:

- Define a common contract.
- Achieve abstraction.
- Ensure consistency across multiple classes.
- Support multiple inheritance-like behavior.

Interfaces make applications loosely coupled and easier to maintain.

---

## Q- What is the difference between `extends` and `implements`?

**Ans-**

| `extends`                    | `implements`                   |
| ------------------------------ | -------------------------------- |
| Used for inheritance.          | Used to implement an interface.  |
| A class extends another class. | A class implements an interface. |
| Inherits implementation.       | Follows a contract.              |

Example:

```typescript
class LoginPage extends BasePage {}

class LoginPage implements ILogger {}
```

---

## Q- Can one interface extend another interface?

**Ans-**

Yes.

An interface can inherit another interface using the `extends` keyword.

Example:

```typescript
interface A {

    display(): void;
}

interface B extends A {

    print(): void;
}
```

Now any class implementing `B` must implement both methods.

---

## Q- Can a class extend multiple classes?

**Ans-**

No.

A class can extend only one class.

```typescript
class A {}

class B {}

class C extends A, B {} // ❌ Error
```

TypeScript does not support multiple inheritance through classes.

---

## Q- Can a class implement multiple interfaces?

**Ans-**

Yes.

A class can implement any number of interfaces.

Example:

```typescript
interface ILogger {

    log(): void;
}

interface IScreenshot {

    takeScreenshot(): void;
}

class LoginPage implements ILogger, IScreenshot {

    log() {}

    takeScreenshot() {}
}
```

This is TypeScript's way of achieving multiple inheritance-like behavior.

---

## Q- Can a class extend one class and implement multiple interfaces?

**Ans-**

Yes.

This is very common in automation frameworks.

Example:

```typescript
class LoginPage
    extends BasePage
    implements ILogger, IScreenshot {

    log() {}

    takeScreenshot() {}
}
```

Here:

- `BasePage` provides reusable implementation.
- Interfaces define additional contracts.

---

## Q- Can we do Upcasting using Interfaces?

**Ans-**

Yes.

An interface can be used as the reference type.

Example:

```typescript
interface IBasePage {

    navigate(): void;
}

class LoginPage implements IBasePage {

    navigate() {}

    login() {}
}

const page: IBasePage = new LoginPage();
```

---

## Q- What methods can we access after Interface Upcasting?

**Ans-**

Only the methods declared in the interface can be accessed.

Example:

```typescript
page.navigate(); // ✅

page.login(); // ❌
```

Although the actual object is `LoginPage`, the reference type is `IBasePage`.

---

## Q- Why is Interface Upcasting useful?

**Ans-**

It promotes:

- Loose coupling
- Better abstraction
- Easier replacement of implementations
- Better maintainability
- Scalability

It is commonly used in Dependency Injection and framework design.

---

# Abstract Classes

## Q- What is an Abstract Class?

**Ans-**

An abstract class is a partially implemented class that serves as a blueprint for other classes.

It can contain:

- Properties
- Constructors
- Normal methods
- Abstract methods

An abstract class cannot be instantiated directly.

It must be extended by a child class.

---

## Q- Why do we use Abstract Classes in Playwright frameworks?

**Ans-**

In Playwright frameworks, `BasePage` is often declared as an abstract class because:

- It contains common reusable methods like:
  - `navigate()`
  - `click()`
  - `fill()`
  - `takeScreenshot()`
- It forces every page class to implement page-specific methods such as:

```typescript
isAt()
```

This ensures consistency across all page classes.

---

## Q- Can we create an object of an Abstract Class?

**Ans-**

No.

An abstract class cannot be instantiated because it may contain abstract methods that don't have implementations.

```typescript
abstract class BasePage {}

const page = new BasePage(); // ❌ Error
```

---

## Q- What can an Abstract Class contain?

**Ans-**

An abstract class can contain:

- Properties
- Constructors
- Normal methods
- Abstract methods

Example:

```typescript
abstract class BasePage {

    constructor() {}

    navigate() {}

    abstract isAt(): boolean;
}
```

---

## Q- Is it mandatory for an Abstract Class to have abstract methods?

**Ans-**

No.

An abstract class may contain:

- Only normal methods
- Only abstract methods
- A combination of both

---

## Q- What happens if a child class doesn't implement all abstract methods?

**Ans-**

The child class must also be declared as `abstract`.

Otherwise, TypeScript reports a compile-time error.

Example:

```typescript
abstract class BasePage {

    abstract isAt(): boolean;
}

abstract class LoginPage extends BasePage {}
```

---

## Q- What is an Abstract Method?

**Ans-**

An abstract method is a method declaration without an implementation.

It is declared using the `abstract` keyword and must be implemented by every concrete child class.

Example:

```typescript
abstract class BasePage {

    abstract isAt(): boolean;
}
```

Implementation:

```typescript
class LoginPage extends BasePage {

    override isAt(): boolean {
        return true;
    }
}
```

An abstract method defines **what should be done**, while the child class decides **how it should be done**.

---

## Q- If we cannot create an object of an Abstract Class, why does it have a constructor?

**Ans-**

The constructor of an abstract class is **not used to create an object of the abstract class itself**.

Instead, it is executed whenever a child class object is created.

Example:

```typescript
abstract class BasePage {

    constructor(public page: string) {}
}

class LoginPage extends BasePage {

    constructor() {
        super("Login Page");
    }
}

const page = new LoginPage();
```

Execution Flow:

```
new LoginPage()
        ↓
LoginPage constructor
        ↓
super("Login Page")
        ↓
BasePage constructor executes
```

The parent constructor initializes the parent portion of every child object.

---

## Q- What is the difference between an Abstract Class and an Interface?

**Ans-**

| Abstract Class                                        | Interface                                   |
| ----------------------------------------------------- | ------------------------------------------- |
| Can contain implemented methods and abstract methods. | Contains only method/property declarations. |
| Declared using`abstract`.                           | Declared using`interface`.                |
| Child class uses`extends`.                          | Class uses`implements`.                   |
| Can have constructors.                                | Cannot have constructors.                   |
| Can have method implementation.                       | Cannot have method implementation.          |
| Can maintain state using properties.                  | Defines only a contract.                    |
| A class can extend only one abstract class.           | A class can implement multiple interfaces.  |
| Provides partial abstraction.                         | Provides complete abstraction.              |

---

## Q- Which is used more in Playwright frameworks: Abstract Class or Interface?

**Ans-**

Both are used, but for different purposes.

- **Abstract classes** are commonly used for `BasePage` because they provide common reusable implementations.
- **Interfaces** are used to define contracts that multiple classes should follow.

In most Playwright frameworks:

- **Abstract Class** → Shared implementation.
- **Interface** → Shared contract.

A common design is:

```typescript
class LoginPage
    extends BasePage
    implements ILogger, IScreenshot
```

where:

- `BasePage` provides reusable functionality.
- Interfaces define additional capabilities without implementation.
