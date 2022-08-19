/**
 * @name parseExpression
 * @description takes a string as input and returns an object containing the data structure for the expression at the start of the string, along with the string remaining after parsing the expression. When parsing subexpressions, this function can be called again, yielding the argument expression as well as the text that remains (which may contain more arguments or the closing parentheses that ends the list of arguments).
 * @param {string} program
 *
 * @returns {object} data structure for the expression at the start of the string, along with the string remaining after parsing the expression
 */
function parseExpression(program) {
	program = skipSpace(program);
	let match, expr;
	//regex
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
