/// <reference path="../.d.ts/sockets.io.d.ts" />
function get_title() {
    return 'TEAN Example';
}

//exports the 'recieved' functions
exports.recieved = function (socket, data) {
    return 'ack';
};
