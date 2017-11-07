var obj = {a: 'original', b:'sad'};
var obj2 = {a: 'changed', b:'happy'};
var f = (function(pobj){
	return function(){
		console.log(JSON.stringify(pobj));
		console.log(`${this.a}, ${this.b}`);
	};
}(obj));

f();
obj = obj2;
//console.log(JSON.stringify(obj));
var y = f.bind(obj2);
y();