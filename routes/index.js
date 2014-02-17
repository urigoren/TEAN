
function get_title()
{
    return 'TEAN Example';
}
//exports the routing functions
exports = function(req, res){
  res.render('index', { title: 'TEAN Example' });
};