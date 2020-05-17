all : codeGen data

codeGen:
	Msgpack/mpc -i ../Assembly-CSharp.csproj  -o "../Assets/Scripts/MasterData/MessagePackGenerated.cs"

data:
	node Tuning/main.js