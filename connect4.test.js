describe('JS code works for in-system management', function(){
  beforeEach(function () {
    makeBoard();
  }); 

  it('should create an empty 2D array called board', function () {
    expect(board.length).toEqual(6);
    expect(board[1].length).toEqual(7);
    expect(board[0][0]).toEqual('');
  });

  it('should find the first empty cell in a given column', function () {
    board [5][2] ='full';
    expect(findSpotForCol(2)).toEqual(4);
  });

  it('should give a winner', function () {
    board [5][2] = 1;
    board [4][2] = 1;
    board [3][2] = 1;
    board [2][2] = 1;
    expect(checkForWin()).toEqual(true);
  });

  afterEach(function () {
    makeBoard();
  });
})



