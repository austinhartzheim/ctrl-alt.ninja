var utils = {};

/*
 * Insert a string into the middle of another string.
 * s1: the base string
 * pos: the position is s1 to insert into
 * s2: the string to insert
 */
utils.string_insert = function(s1, pos, s2) {
    return s1.slice(0, pos) + s2 + s1.slice(pos);
};
