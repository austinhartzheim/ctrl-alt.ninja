var utils = {};
var escape_map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
};

/*
 * Insert a string into the middle of another string.
 * s1: the base string
 * pos: the position is s1 to insert into
 * s2: the string to insert
 */
utils.string_insert = function(s1, pos, s2) {
    return s1.slice(0, pos) + s2 + s1.slice(pos);
};

utils.string_delete_char = function(str, pos) {
    return str.slice(0, pos) + str.slice(pos + 1);
};

utils.string_escape = function(str) {
    return String(str).replace(/[&<>"'\/]/g, function(s) {
        return escape_map[s];
    });
};
