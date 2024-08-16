# toml = require '@iarna/toml'
toml = require "../toml"


input1 = """
#com0 __0:
#com00 __1
[abc] #com1 abc:{__0}
yy=0 #com2
[abc.d] #com3
  foo = 123 #comm4
[[]]
0:ddd
1:ddd
nan=nan
null=null
null1= 'null'
bar = [1, 2, 'null'] #comm5
[ef] #com6
# com8
tt="kkkk" #com7
"""


tomlString = "[abc]\nfoo = 123 #comm\nnan=nan\nnull=null\nnull1= 'null'\nbar = [1, 2, 'null']";
# tomlList = tomlString.split();
# charLists = Array.from(tomlString);

# console.log(charLists[35]);

obj = toml.parse(input1)
str = toml.stringify(obj)

console.log(str)

