# programming-language

Rudimentary programming language focused on providing a simple abstraction based on functions.

## Syntax

Everything in this programming language is an expression. An expression can be the name of a binding, a number, a string, or an _application_.

Applications are used for function calls but also for constructs such as `if` or `while`

A **string** is a sequence of charactesr that are not double quotes, wrapped in double quotes. For simplicity, **strings** in this programming language do not support anything like backslash escapes.

A **number** is a sequence of digits.

**Binding names** can consist of any character that is not whitespace and that does not have a special meaning in the syntax.

**Applications** are written similar to JavaScript, by putting parentheses after an expression and having any number of arguments between those parentheses, separated by commas.

```
do(define(x, 10),
    if(>(x, 5),
        print("large"),
        print("small")))
```
