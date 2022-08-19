/**
 * @name skipSpace
 * @description cuts off whitespace at beginning of input string
 * @param {string} string
 * @returns {string} with whitespace cut off of front
 */
function skipSpace(string) {
	let first = string.search(/\S/);
	if (first == -1) return "";
	return string.slice(first);
}

/**
 * @name parseExpression
 * @description takes a string as input and returns an object containing the data structure for the expression at the start of the string, along with the string remaining after parsing the expression. When parsing subexpressions, this function can be called again, yielding the argument expression as well as the text that remains (which may contain more arguments or the closing parentheses that ends the list of arguments).
 * @param {string} program
 *
 * @returns {object} data structure (depending on type) for the expression at the start of the string, along with the string remaining after parsing the expression
 */
function parseExpression(program) {
	program = skipSpace(program);
	let match, expr;
	//regular expressions
	const stringRegEx = /^"([^"]*)"/;
	const numberRegEx = /^\d+\b/;
	const wordRegEx = /^[^\s(),#"]+/;

	if ((match = stringRegEx.exec(program))) {
		expr = { type: "value", value: match[1] };
	} else if ((match = numberRegEx.exec(program))) {
		expr = { type: "value", value: Number(match[0]) };
	} else if ((match = wordRegEx.exec(program))) {
		expr = { type: "word", value: match[0] };
	} else {
		throw new SyntaxError("Unexpected syntax: " + program);
	}

	return parseApply(expr, program.slice(match[0].length));
}

/**
 * @name parseApply
 * @description takes output of parseExpression (the object for the expression, along with the cut off part that was matched from the program string).
 * parseApply() then checks whether the expression is an application. If so, it parses a parenthesized list of arguments.
 * @param {object} expr
 * @param {string} program
 *
 * @returns {object} recursively calls itself into syntax tree is fully examined. Returns an object containing the application expression syntax tree object and updated program string
 */
function parseApply(expr, program) {
	program = skipSpace(program);
	// if the first character in the program is not an opening parenthesis "(", this is not an application so input expression is returned
	while (program[0] != "(") {
		return { expr: expr, rest: program };
	}
	// update program string to be after the initial opening parenthesis "("
	program = skipSpace(program.slice(1));
	// update syntax tree object (expression) to reflection an application type
	expr = { type: "apply", operator: expr, args: [] };
	// iteratate through program string until a closing parenthesis ")"
	while (program[0] != ")") {
		// program string is parsed to become a function argument/parameter
		let arg = parseExpression(program);
		// returned value from parseExpression() has an "expr" property, which is pushed into the args array for our application expression
		expr.args.push(arg.expr);
		// update program string using the "rest" property value from the parseExpression() output
		program = skipSpace(arg.rest);
		// if iteration reaches a comma, update program string to skip ","
		if (program[0] == ",") {
			program = skipSpace(program.slice(1));
		} else if (program[0] != ")") {
			// if no closing parenthesis ")" are reached, throw a syntax error
			throw new SyntaxError("Expected ',' or ')'");
		}
	}
	// return an object containing the application expression syntax tree object and updated program string
	return parseApply(expr, program.slice(1));
}

/**
 * @name parse
 * @description parses the provided expression and verifies it has reached the end of the input string
 * @param {string} program - a single expression containing program instructions
 *
 * @returns {object} returns the program's data structure
 */
function parse(program) {
	let { expr, rest } = parseExpression(program);
	if (skipSpace(rest).length > 0) {
		throw new SyntaxError("Unexpected text after program");
	}
	return expr;
}
console.log(parse("+(a, 10)"));
// {
//     type: "apply",
//     operator: {
//         type: "word",
//         value: "+"
//     },
//     args: [
//         {
//         type: "word",
//         value: "a"
//         },
//         {
//         type: "value",
//         value: 10
//         }
//     ]
// }

/**
 * @name evaluate
 * @description provided a syntax tree and a scope object that associates names with values, the function evaluates the expression that the syntax tree represents and returns the produced value.
 * @param {object} expr - syntax tree object
 * @param {object} scope - scope object with associates names with values describing code environment
 *
 * @returns {object} returns the program's data structure
 */
const specialForms = Object.create(null);
function evaluate(expr, scope) {
	if (expr.type == "value") {
		return expr.value;
	} else if (expr.type == "word") {
		if (expr.name in scope) {
			return scope[expr.name];
		} else {
			throw new ReferenceError(`Undefined binding: ${expr.name}`);
		}
	} else if (expr.type == "apply") {
		let { operator, args } = expr;
		if (operator.type == "word" && operator.name in specialForms) {
			return specialForms[operator.name](expr.args, scope);
		} else {
			let op = evaluate(operator, scope);
			if (typeof op === "function") {
				return op(...args.map((arg) => evaluate(arg, scope)));
			} else {
				throw new TypeError(`Applying a non-function.`);
			}
		}
	}
}
