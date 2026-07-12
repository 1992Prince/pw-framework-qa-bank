# Access Modifiers

## Q- What are Access Modifiers?

**Ans-**

- Access modifiers control the visibility (accessibility) of class properties and methods.
- They define where a property or method can be accessed from.
- TypeScript provides three access modifiers:
  - `public`
  - `protected`
  - `private`

---

## Q- What is the default access modifier in TypeScript?

**Ans-**

`public` is the default access modifier.

```typescript
class Employee {
    name: string; // public by default
}
```

The above is equivalent to:

```typescript
class Employee {
    public name: string;
}
```

---

## Q- What is the difference between `public`, `protected`, and `private`?

**Ans-**

| Access Modifier | Inside Class | Child Class | Outside Class |
| --------------- | ------------ | ----------- | ------------- |
| `public`      | ✅ Yes       | ✅ Yes      | ✅ Yes        |
| `protected`   | ✅ Yes       | ✅ Yes      | ❌ No         |
| `private`     | ✅ Yes       | ❌ No       | ❌ No         |

- **public** → Accessible from anywhere.
- **protected** → Accessible only within the class and its child classes.
- **private** → Accessible only within the class where it is declared.

---

## Q- When do you use `protected` in a Playwright framework?

**Ans-**

We use `protected` for common helper methods that should be shared with all page classes but should not be directly accessed by test classes.

Common examples include:

- `click()`
- `fill()`
- `waitForPageLoad()`
- `waitForSpinner()`
- `scrollIntoView()`

Example:

```typescript
class BasePage {

    protected async waitForSpinner() {
        // Wait until loading spinner disappears
    }
}

class LoginPage extends BasePage {

    async login() {
        await this.waitForSpinner(); // ✅ Allowed
    }
}
```

The test class cannot call `waitForSpinner()` directly because it is `protected`.

---

## Q- When do you use `private`?

**Ans-**

We use `private` for helper methods or variables that are internal implementation details of a class.

They should not be accessed by child classes or external code because they are not part of the class's public API.

Example:

```typescript
class LoginPage {

    private generateToken() {
        return "abc123";
    }

    async login() {
        const token = this.generateToken(); // ✅ Allowed
    }
}
```

---

## Q- Can a child class access private members?

**Ans-**

No.

Private members belong only to the class in which they are declared.

Example:

```typescript
class Parent {

    private name = "Prince";
}

class Child extends Parent {

    show() {
        console.log(this.name); // ❌ Error
    }
}
```

---

## Q- Can a child class access protected members?

**Ans-**

Yes.

Protected members are accessible inside child classes but cannot be accessed from outside the class hierarchy.

Example:

```typescript
class Parent {

    protected name = "Prince";
}

class Child extends Parent {

    show() {
        console.log(this.name); // ✅ Allowed
    }
}
```

Outside the class:

```typescript
const child = new Child();

console.log(child.name); // ❌ Error
```

---

## Q- Which access modifier is used most in Playwright frameworks?

**Ans-**

- **public** is used for page action methods that test classes call directly.
- **protected** is commonly used in the `BasePage` for reusable helper methods.
- **private** is used less frequently for class-specific implementation details.

Example:

```typescript
class LoginPage extends BasePage {

    public async login(username: string, password: string) {
        await this.fill(this.usernameInput, username);
        await this.fill(this.passwordInput, password);
    }

    private validateCredentials() {
        // Internal validation
    }
}
```

---

## Q- What is the `readonly` modifier?

**Ans-**

The `readonly` modifier makes a class property immutable after initialization.

A `readonly` property can be assigned:

- At the time of declaration, or
- Inside the constructor.

After that, it cannot be reassigned.

Example:

```typescript
class Employee {

    readonly id: number;

    constructor(id: number) {
        this.id = id; // ✅ Allowed
    }
}

const emp = new Employee(101);

emp.id = 102; // ❌ Error
```

---

## Q- Where is `readonly` used in Playwright frameworks?

**Ans-**

In Playwright Page Object Model (POM), `readonly` is commonly used for locators because:

- Locators are initialized only once.
- They should never be reassigned.
- It prevents accidental modification.
- It makes Page Objects safer and easier to maintain.

Example:

```typescript
import { Page, Locator } from '@playwright/test';

class LoginPage {

    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(private page: Page) {
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('#login');
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}
```

If someone tries to reassign a locator:

```typescript
this.loginButton = this.page.locator('#submit'); // ❌ Error
```

TypeScript will throw a compile-time error because the property is `readonly`.

---

## Q- Why do we use `readonly` instead of `const`?

**Ans-**

`const` is used for variables, whereas `readonly` is used for class properties.

Example:

```typescript
const company = "Google"; // Variable
```

```typescript
class LoginPage {

    readonly usernameInput: Locator;

    constructor(page: Page) {
        this.usernameInput = page.locator('#username');
    }
}
```

You cannot declare a class property using `const`.

```typescript
class LoginPage {

    const usernameInput = page.locator('#username'); // ❌ Invalid
}
```

Therefore:

- Use **`const`** for variables.
- Use **`readonly`** for class properties that should not change after initialization.

---

## Q- What are the benefits of using `readonly`?

**Ans-**

Using `readonly` provides several benefits:

- Prevents accidental reassignment of properties.
- Makes the code more predictable and easier to maintain.
- Clearly indicates that the property is fixed after initialization.
- Improves code safety by catching reassignment errors at compile time.
- Commonly used for Playwright locators because locator references should remain constant throughout the lifetime of the Page Object.
