
# OOP Concepts in TypeScript

## Q- What are the OOP concepts in TypeScript?

**Ans-**

TypeScript supports the four main Object-Oriented Programming (OOP) concepts:

1. **Encapsulation** – Wrapping data and methods inside a class and controlling access using access modifiers (`public`, `protected`, `private`).
2. **Inheritance** – Allowing one class to inherit properties and methods from another class using the `extends` keyword.
3. **Polymorphism** – Allowing the same method to have different implementations through method overriding.
4. **Abstraction** – Hiding implementation details and exposing only the necessary functionality using abstract classes and interfaces.

---

## Q- What is Inheritance? How have you implemented it in your Playwright framework?

**Ans-**

Inheritance allows a child class to inherit the properties and methods of a parent class using the `extends` keyword.

It promotes code reusability, reduces duplication, and makes the framework easier to maintain.

In our Playwright framework:

- `BasePage` is the parent class.
- It contains common reusable methods like:
  - `navigate()`
  - `click()`
  - `fill()`
  - `waitForSpinner()`
  - `takeScreenshot()`
- Page classes such as `LoginPage`, `HomePage`, and `DashboardPage` extend `BasePage` and reuse these common methods.

Example:

```typescript
class BasePage {

    navigate() {
        console.log("Navigate to page");
    }
}

class LoginPage extends BasePage {

    login() {
        console.log("Login successful");
    }
}

const page = new LoginPage();

page.navigate();
page.login();
```

---

## Q- What are the different types of inheritance? Which one is not supported in TypeScript?

**Ans-**

### Supported

- Single Inheritance
- Multilevel Inheritance
- Hierarchical Inheritance

### Not Supported

- Multiple Inheritance

A class cannot extend more than one class.

Example:

```typescript
class A {}

class B {}

class C extends A, B {} // ❌ Error
```

TypeScript supports multiple inheritance-like behavior through **interfaces**, but not through classes.

---

## Q- What is Method Overriding?

**Ans-**

Method overriding means providing a new implementation of a parent class method in the child class.

When the overridden method is called, the child class implementation is executed at runtime.

Example:

```typescript
class BasePage {

    isAt() {
        console.log("Base Page");
    }
}

class LoginPage extends BasePage {

    override isAt() {
        console.log("Login Page");
    }
}

const page = new LoginPage();

page.isAt();
```

Output:

```
Login Page
```

---

## Q- What is Upcasting?

**Ans-**

Upcasting means storing a child class object in a parent class reference.

Example:

```typescript
const page: BasePage = new LoginPage();
```

Benefits:

- Promotes loose coupling.
- Supports polymorphism.
- Only parent class members are accessible through the parent reference.
- If a method is overridden, the child class implementation is executed at runtime.

---

## Q- What is Downcasting? Is it supported in TypeScript?

**Ans-**

Downcasting means converting a parent class reference back to a child class reference to access child-specific methods.

Unlike Java or C#, TypeScript does not support traditional runtime downcasting.

Instead, it provides **type assertion**, which is only a compile-time feature.

Example:

```typescript
const page: BasePage = new LoginPage();

const loginPage = page as LoginPage;

loginPage.login();
```

**Important:**

Type assertion does **not** perform runtime validation. It simply tells the TypeScript compiler to treat the object as the specified type.

---

## Q- What is the purpose of `super`?

**Ans-**

The `super` keyword refers to the parent class.

It is mainly used to:

- Call the parent class constructor using `super()`.
- Call parent class methods using `super.methodName()`.

Example:

```typescript
class BasePage {

    constructor(public page: Page) {}
}

class LoginPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }
}
```

Example of calling a parent method:

```typescript
class BasePage {

    takeScreenshot() {
        console.log("Taking screenshot");
    }
}

class LoginPage extends BasePage {

    capture() {
        super.takeScreenshot();
    }
}
```

---

## Q- What is the difference between `this` and `super`?

**Ans-**

| `this`                                       | `super`                                             |
| ---------------------------------------------- | ----------------------------------------------------- |
| Refers to the current object.                  | Refers to the parent class.                           |
| Accesses current class properties and methods. | Calls the parent constructor and parent methods.      |
| Used inside any class.                         | Used only inside child classes.                       |
| Example:`this.page`                          | Example:`super(page)` or `super.takeScreenshot()` |

Example:

```typescript
class BasePage {

    constructor(public page: Page) {}

    takeScreenshot() {
        console.log("Screenshot captured");
    }
}

class LoginPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    login() {
        console.log(this.page);      // Current object's property
        super.takeScreenshot();      // Parent class method
    }
}
```
# Q- Explain the OOP concepts you have used in your Playwright framework.

**Ans-**

TypeScript supports the four main Object-Oriented Programming (OOP) concepts:

1. Encapsulation
2. Inheritance
3. Polymorphism
4. Abstraction

---

## 1. Encapsulation

**Ans-**

Encapsulation means wrapping data (properties) and behavior (methods) inside a class while restricting direct access to the internal data.

This is achieved using access modifiers such as:

- `public`
- `protected`
- `private`

Private properties are typically accessed using **getter** and **setter** methods, allowing us to add validation before reading or updating the value.

### Example

```typescript
class BankAccount {

    private balance: number;

    constructor(balance: number) {
        this.balance = balance;
    }

    public getBalance(): number {
        return this.balance;
    }

    public setBalance(amount: number): void {

        if (amount < 0) {
            console.log("Balance cannot be negative.");
            return;
        }

        this.balance = amount;
    }
}

const account = new BankAccount(1000);

account.setBalance(2000);

console.log(account.getBalance());
```

### How is Encapsulation used in our Playwright framework?

- Common helper methods in `BasePage` are declared as **protected**, so only page classes can use them.
- Locator properties inside page classes are generally declared as **private readonly**.
- This prevents tests or other classes from directly accessing or modifying the locators.
- Tests interact only through public page action methods such as `login()`, `searchProduct()`, or `checkout()`.

---

## 2. Inheritance

**Ans-**

Inheritance allows a child class to inherit the properties and methods of a parent class using the `extends` keyword.

It promotes:

- Code reusability
- Reduced duplication
- Easier maintenance

### Example

```typescript
class BasePage {

    protected navigate(url: string) {
        console.log(`Navigating to ${url}`);
    }

    protected takeScreenshot() {
        console.log("Screenshot captured");
    }
}

class LoginPage extends BasePage {

    login() {
        this.navigate("/login");
        console.log("Login successful");
    }
}
```

### How is Inheritance used in our Playwright framework?

`BasePage` acts as the parent class.

It contains reusable methods like:

- `click()`
- `fill()`
- `navigate()`
- `waitForSpinner()`
- `takeScreenshot()`

All page classes such as `LoginPage`, `HomePage`, and `DashboardPage` extend `BasePage` and reuse these common methods.

---

## 3. Polymorphism

**Ans-**

Polymorphism means allowing the same method to have different implementations in different classes.

There are two types of polymorphism:

- Compile-time polymorphism (Method Overloading)
- Runtime polymorphism (Method Overriding)

JavaScript and TypeScript **do not support true method or constructor overloading** like Java or C#.

In TypeScript, polymorphism is mainly achieved through **method overriding**.

### Example

```typescript
class BasePage {

    isAt() {
        console.log("Base Page");
    }
}

class LoginPage extends BasePage {

    override isAt() {
        console.log("Login Page");
    }
}

const page: BasePage = new LoginPage();

page.isAt();
```

Output:

```
Login Page
```

Although the reference type is `BasePage`, the overridden method of `LoginPage` is executed at runtime.

### How is Polymorphism used in our Playwright framework?

If multiple page classes implement a common method such as `isAt()`, each page provides its own implementation.

At runtime, the correct implementation is called depending on the actual object.

---

## 4. Abstraction

**Ans-**

Abstraction means hiding implementation details and exposing only the necessary functionality.

In TypeScript, abstraction is achieved using:

- Abstract classes
- Interfaces

Users only know **what** a method does, not **how** it is implemented internally.

### Example using Abstract Class

```typescript
abstract class BasePage {

    abstract isAt(): boolean;

    navigate(url: string) {
        console.log(`Navigating to ${url}`);
    }
}

class LoginPage extends BasePage {

    override isAt(): boolean {
        return true;
    }
}
```

### How is Abstraction used in our Playwright framework?

In our framework:

- Tests never interact directly with Playwright APIs like `locator()`, `click()`, or `fill()`.
- Instead, they call high-level methods such as:
  - `login()`
  - `searchProduct()`
  - `placeOrder()`
- The internal Playwright implementation remains hidden inside the Page Object classes.

This keeps the tests clean, readable, and easy to maintain.