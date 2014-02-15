exports.const = function (req, res)
{
    res.json('value');
};
exports.echo = function(req, res)
{
  res.json(req.param('param'));
};
exports.add = function(req, res)
{
  res.json(parseInt(req.param('num1'))+parseInt(req.param('num2')));
};