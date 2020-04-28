var members = ['ddd','aaa','ccc'];
var i =0;

while(i<members.length){
  console.log(members[i]);
  i += 1;
}


var role = {
  'pro':'ahn',
  'manager':'lee'
}

for(var name in role){
  console.log(name, role[name]);
}

var o = {
  v1:'v1',
  v2:'v2',
  v3:function(){
    console.log(this.v1);
  }
}

o.v3();
