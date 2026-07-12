
# Classes and Constructors

## Q- What is a Class?

**Ans-**

A class is a blueprint or template for creating objects. It defines the properties (variables) and methods (functions) that an object will have.

For example:

- `Employee` is the class.
- `name`, `age`, `isEmployee`, `qualifications`, and `address` are properties.
- `displayDetails()` is a method.
- `emp1` is an object (instance) of the `Employee` class.

Example:

```typescript
class Employee {

    name: string;
    age: number;
    isEmployee: boolean;
    qualifications: string[];
    address: {
        city: string;
        state: string;
    };

    constructor(
        name: string,
        age: number,
        isEmployee: boolean,
        qualifications: string[],
        address: { city: string; state: string }
    ) {
        this.name = name;
        this.age = age;
        this.isEmployee = isEmployee;
        this.qualifications = qualifications;
        this.address = address;
    }

    public displayDetails(): void {
        console.log(`Name: ${this.name}`);
        console.log(`Age: ${this.age}`);
        console.log(`Employee: ${this.isEmployee}`);
        console.log(`Qualifications: ${this.qualifications.join(", ")}`);
        console.log(`Address: ${this.address.city}, ${this.address.state}`);
    }
}

const emp1 = new Employee(
    "John Doe",
    30,
    true,
    ["B.Tech", "AWS Certified"],
    {
        city: "Delhi",
        state: "Delhi"
    }
);

emp1.displayDetails();
```

---

## Q- What is a Constructor? What is its purpose?

**Ans-**

A constructor is a special method that is automatically called when an object is created.

Its main purpose is to initialize the object's properties.

Characteristics:

- Has the name `constructor`.
- Executes automatically when `new` is used.
- A class can have only one constructor.
- It is mainly used to initialize properties and perform setup tasks.

Example:

```typescript
class Employee {

    constructor(public name: string, public age: number) {
        console.log("Employee object created.");
    }
}

const emp = new Employee("John", 25);
```

Output:

```
Employee object created.
```

---

## Q- What is the `this` keyword? What is its purpose in OOP?

**Ans-**

`this` refers to the current object (current instance) of a class.

It is used to access the current object's:

- Properties
- Methods
- Constructor parameters

Example:

```typescript
class Employee {

    constructor(public name: string) {}

    public display() {
        console.log(this.name);
    }
}

const emp = new Employee("Prince");

emp.display();
```

Here, `this.name` refers to the `name` property of the current `Employee` object.

---

## Q- Does JavaScript/TypeScript support constructor overloading?

**Ans-**

No.

JavaScript and TypeScript do not support multiple constructor implementations.

A class can have only one constructor.

❌ Invalid:

```typescript
class Employee {

    constructor() {}

    constructor(name: string) {} // Error
}
```

However, TypeScript allows constructor overload **signatures**, but there must be only one implementation.

Example:

```typescript
class Employee {

    constructor();
    constructor(name: string);

    constructor(name?: string) {
        console.log(name);
    }
}
```

This is called **constructor overloading using overload signatures**, but internally there is still only **one constructor implementation**.

---

## Q- What are the different types of constructors? Does TypeScript support both?

**Ans-**

There are two commonly discussed types of constructors:

### 1. Default Constructor

A constructor that takes no parameters.

```typescript
class Employee {

    constructor() {
        console.log("Default constructor");
    }
}
```

---

### 2. Parameterized Constructor

A constructor that accepts parameters to initialize object properties.

```typescript
class Employee {

    constructor(public name: string, public age: number) {}
}
```

Yes, TypeScript supports both default and parameterized constructors.

---

## Q- What is the difference between `this` and `super`?

**Ans-**

| `this`                                             | `super`                                                     |
| ---------------------------------------------------- | ------------------------------------------------------------- |
| Refers to the current class instance.                | Refers to the parent (base) class.                            |
| Used to access current class properties and methods. | Used to access parent class methods and constructor.          |
| Can be used in any class.                            | Can only be used in a child class that extends another class. |

Example:

```typescript
class Animal {

    makeSound() {
        console.log("Animal Sound");
    }
}

class Dog extends Animal {

    makeSound() {
        super.makeSound(); // Parent method
        console.log("Dog Bark");
    }
}

const dog = new Dog();

dog.makeSound();
```

Output:

```
Animal Sound
Dog Bark
```

---

## Q- Which comes first in a child class constructor: `this` or `super`?

**Ans-**

In a child class, **`super()` must always be called before using `this`**.

Reason:

The parent class must be initialized before the child class can access its own properties.

Example:

```typescript
class Animal {

    constructor(public name: string) {}
}

class Dog extends Animal {

    constructor(name: string, public breed: string) {

        super(name); // ✅ Must be first

        console.log(this.breed);
    }
}
```

❌ Incorrect:

```typescript
class Dog extends Animal {

    constructor(name: string, public breed: string) {

        console.log(this.breed); // Error

        super(name);
    }
}
```

TypeScript will throw an error:

> **'super' must be called before accessing 'this' in the constructor of a derived class.**

---

## Q- Can `super` access parent class properties?

**Ans-**

Yes, but with an important distinction.

- `super` is primarily used to call the parent class constructor and parent class methods.
- Parent properties are inherited by the child object and are typically accessed using `this`, not `super`.

Example:

```typescript
class Animal {

    constructor(public name: string) {}

    makeSound() {
        console.log("Animal Sound");
    }
}

class Dog extends Animal {

    constructor(name: string) {
        super(name);
    }

    show() {
        console.log(this.name); // ✅ Preferred
        super.makeSound();       // ✅ Calling parent method
    }
}
```

While JavaScript allows `super.property` in some scenarios (such as accessing getters on the parent prototype), in normal TypeScript class design you access inherited properties through `this`.

**Interview Tip:**

- Use **`this`** for properties.
- Use **`super()`** to call the parent constructor.
- Use **`super.method()`** to call a parent method.
