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

- the language has no concept of a block, so a `do` construct is required to represent doing multiple tasks in a sequence.

The data structure that the parser will use to describe a program consists of expression objects, each of which has a `type` property indicating the kind of expression it is and other properties to describe its content.

### Expression Types

Expressions of type `value` represent literal strings or numbers. Their `value` property contains the string or number value that they represent.

Expressions of type `word` are used for identifiers (names). Such objects have a `name` property that holds the identifier's name as a string.

Finally, `apply` expressions represent applications. They have an `operator` property that refers to the expression that is being applied, as well as an `args` property to holds an array of argument expressions.

## Parser

Expressions have a recursive structure – application expressions contain other expressions. Thus, the parser is written to reflect this recursive nature.

Function `parseExpression` takes a string as input and returns an object containing the data structure for the expression at the start of the string, along with the string remaining after parsing the expression.
When parsing subexpressions, this function can be called again, yielding the argument expression as well as the text that remains (which may contain more arguments or the closing parentheses that ends the list of arguments).
