// Execute an authored console command, preserving earlier commands and real Python expression display.
export function buildStoryConsoleProgram(initial, previous, command) {
  return (
    `import ast as _pybe_ast, contextlib as _pybe_context, io as _pybe_io, json as _pybe_json\n` +
    `with _pybe_context.redirect_stdout(_pybe_io.StringIO()):\n    exec(${JSON.stringify(initial + "\n" + previous.join("\n"))},globals())\n` +
    `_pybe_tree=_pybe_ast.parse(${JSON.stringify(command)},mode='exec')\nif _pybe_tree.body and isinstance(_pybe_tree.body[-1],_pybe_ast.Expr):\n    _pybe_last=_pybe_tree.body.pop()\n    exec(compile(_pybe_tree,'<console>','exec'),globals())\n    _pybe_value=eval(compile(_pybe_ast.Expression(_pybe_last.value),'<console>','eval'),globals())\n    if _pybe_value is not None: print(repr(_pybe_value))\nelse:\n    exec(compile(_pybe_tree,'<console>','exec'),globals())\nprint('\\n__PYBE_CONSOLE__'+_pybe_json.dumps({'vault':globals().get('vault',None)},default=str))`
  );
}
