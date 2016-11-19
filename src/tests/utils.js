describe('test utils', function() {
    it('test beginning case', function() {
        expect(utils.string_delete_char('abc', 0)).toBe('bc');
    });
    
    it('test middle case', function() {
        expect(utils.string_delete_char('abc', 1)).toBe('ac');
    });

    it('test end case', function() {
        expect(utils.string_delete_char('abc', 2)).toBe('ab');
    });
});
