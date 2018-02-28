/*	暂未实现移动动画、合并动画	*/

var score = 0;				// 当前得分
var board = new Array();	// 游戏数据
var isMoved = '';		// 是否移动了
var pubClass = 'grid_item';
var result = document.getElementById('result');
var clazz = {				// 类对应关系
				0: ' zero',
				2: ' two',
				4: ' four',
				8: ' eight',
				16: ' sixteen',
				32: ' thirty_two',
				64: ' sixty_four',
				128: ' one_hundred_twenty_eight',
				256: ' two_hundred_fifty_six',
				512: ' five_hundred_twelve',
				1024: ' one_thousand_twenty_four',
				2048: ' two_thousand_fourty_eight',
				'newNum': ' newNum',
				'merge': ' merge',
				// 'move': ' moved',
				' ': ''
			}
/* 初始化数据 */
function init(){
	result.style.opacity = 0;
	score = 0;
	for (let i = 0; i < 4; i++) {
		board[i] = new Array();
		for (let j = 0; j < 4; j++) {
			board[i][j] = 0;
		}
	}
}

/* 随机一个位置随机生成数字 */
function randomNum(){
	var randx = Math.floor((Math.random() * 10)) % 4;
	var randy = Math.floor((Math.random() * 10)) % 4;
	let count = 0;
	while (board[randx][randy] && board[randx][randy] !== 0) {
		randx = Math.floor((Math.random() * 10)) % 4;
		randy = Math.floor((Math.random() * 10)) % 4;
		count ++;
		if (count === 100) break;
	}
	/*	如果随机100次还未找到空白位置则直接遍历 在第一个空白位置生成	*/
	if (count === 100) { 
		for (let i = 0; i < 4; i++){
			for (let j =0; j < 4; j++) {
				if (board[i][j] === 0) {
					randx = i;
					randy = j;
					break; 
				}
			}
		}
	}
	let value = board[randx][randy];
	if (value === 0) {
		board[randx][randy] = Math.random() < 0.5 ? 2 : 4;
		let el = document.getElementById('item_'+(randx+1)+'_'+(randy+1));
		el.className = pubClass + ' newNum 0';
	}
}

/* 渲染游戏界面 */
function updateBoardView(){
	for(let i = 1; i <= 4; i++) {
		for (let j = 1; j <= 4; j++) {

			let value = board[i-1][j-1];
			let el = document.getElementById('item_'+i+'_'+j);
			el.innerText = value === 0 ? '' : value;
			let style = el.className.toString(); //merge newNum
			let flag = style.match('newNum 0') ? 'newNum' : (style.match('merge 0') ? 'merge' : ' ');
			
			// if (value != 0 && (isMoved && ((isMoved === 'up' && i !== 1) || (isMoved === 'down' && i != 4) || 
			// 	(isMoved === 'left' && j != 1) || (isMoved === 'right' && j != 4))) && !(style.match('newNum'))) {
			// 	let x = isMoved === 'up' ? -120 : (isMoved === 'down' ? 120 : 0);
			// 	let y = isMoved === 'right' ? 120 : (isMoved === 'left' ? -120 : 0);
			// 	console.log("x=",x,"y=",y);
			// 	el.style.transform = "translate("+y+"px, "+x+"px)";
			// }
			el.className = pubClass + clazz[value] + clazz['flag'];
			
		}
	}
}

/* 监听键盘事件 */
document.onkeydown = function handleKeyDown(e){
	if (canMove()) {
		isMoved = '';
		// Up
		if (e && e.keyCode === 38) {
			moveUp();
		}
		// Down
		if (e && e.keyCode === 40) {
			moveDown();
		}
		// Left
		if (e && e.keyCode === 37) {
			moveLeft();
		}
		// Right
		if (e && e.keyCode === 39) {
			moveRight();
		}
		if (isMoved) {
			randomNum();
			getScore();
			updateBoardView();
		}
	}
	canMove();
}

/* 判断水平方向是否有障碍 */
function hasLevBlock(row, col1, col2){
	let arr = board;
	for (let i = col1 + 1 ; i < col2; i++){
		if (arr[row][i] !== 0 && arr[row][i]!== arr[row][col1] && arr[row][i] !== arr[row][col2]) return true;
	}
	return false;
}

/* 判断垂直方向是否有障碍 */
function hasVerBlock(col, row1, row2){
	let arr = board;
	for (let i = row1 + 1 ; i < row2; i++){
		if (arr[i][col] !== 0 && arr[i][col]!== arr[row1][col] && arr[i][col] !== arr[row2][col])  return true;
	}
	return false;
}
function moveUp(){
	isMoved = '';
	let arr = board;
	for (let i = 1; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			if (arr[i][j] === 0) continue; 
			for (let k = 0; k < i ; k++){
				if (arr[k][j] === 0 || (arr[i][j] === arr[k][j] && !hasVerBlock(j, k, i))) {
					arr[k][j] += arr[i][j];
					arr[i][j] = 0;
					isMoved = 'up';
				}
			}
		}
	}
}

function moveDown(){
	isMoved = '';
	let arr = board;
	for (let i = 2; i >= 0; i--) {
		for (let j = 0; j < 4; j++) {
			if (arr[i][j] === 0) continue;
			for (let k = 3; k > i ; k--) {
				if (arr[k][j] === 0 || (arr[i][j] === arr[k][j] && !hasVerBlock(j, i, k))) {
					arr[k][j] += arr[i][j];
					arr[i][j] = 0;
					isMoved = 'down';
				}
			}
		}
	}
}

function moveLeft() {
	isMoved = '';
	let arr = board;
	arr[0][0] = 2048;
	for (let i = 0; i < 4; i++) {
		for (let j = 1; j < 4; j++) {
			if (arr[i][j] === 0) continue;
			for (let k = 0; k < j ; k++) {
				if (arr[i][k] === 0 || (arr[i][j] === arr[i][k] && !hasLevBlock(i, k, j))) {
					arr[i][k] += arr[i][j];
					arr[i][j] = 0;
					isMoved = 'left';
				}
			}
		}
	}
}

function moveRight() {
	isMoved = '';
	let arr = board;
	for (let i = 0; i < 4; i++) {
		for (let j = 2; j >= 0; j--) {
			if (arr[i][j] === 0) continue;
			for (let k = 3; k > j ; k--) {
				if (arr[i][k] === 0 || (arr[i][j] === arr[i][k] && !hasLevBlock(i, j, k))) {
					arr[i][k] += arr[i][j];
					arr[i][j] = 0;
					isMoved = 'right';
				}
			}
		}
	}
}

function canMove() {
	let arr = board;
	let flag = false;
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			if (board[i][j] === 2048) {
				result.style.opacity = 0.6;
				result.children[0].innerText = '获 胜';
				return false;
			}
		}
	}
	if (arr[3][3] === 0) {
		return true
	}
	for (let i = 0;i < 3;i++) {
		if (arr[i][3] ===0 || arr[i][3] === arr[i+1][3]) {
			return true
		}
		for (let j = 0; j < 3; j++) {
			if (arr[3][j] === 0 || arr[3][j] === arr[3][j+1]) {
				return true
			}
			if (arr[i][j] === 0 || arr[i][j] === arr[i+1][j] || arr[i][j] === arr[i][j+1]) {
				return true
			}
		}
	}
	result.style.opacity = 0.6;
	return false;
}

/* 计算当前得分 */
function getScore() {
	score = 0;
	board.forEach(item =>{
		item.forEach(el =>{
			score += Number(el);
		})
	});
	document.getElementById('score').innerText = score;
}

/* 新游戏 */
function newGame() {
	init();
	randomNum();
	randomNum();
	updateBoardView();
	getScore();
}
