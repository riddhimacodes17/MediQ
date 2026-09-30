import { useState, useEffect } from 'react';
import { supabase } from "./lib/supabaseClient";

function App() {
const [page,setPage]=useState("loginChoice");
const [fullName,setName]=useState("");
const [age,setAge]=useState("");
const [token,setToken]=useState(1);
const [nextToken,setNextToken]=useState(1);
const [queue,setQueue]=useState([]);
const [currentPatient, setCurrentPatient]=useState(null);
if(page==="patient") {
 return (
<PatientDetails 
setPage={setPage}
fullName={fullName}
age={age}
setName={setName}
setAge={setAge}
nextToken={nextToken}
setToken={setToken}
setNextToken={setNextToken}
queue={queue}
setQueue={setQueue}
/>
  );
}
if(page==="token") {
  return(
    <TokenPage 
    token={token}
    setPage={setPage}
    currentPatient={currentPatient}
    />
  );
}
if(page==="doctor") {
  return(
    <CallNextPatient 
    queue={queue}
    setQueue={setQueue}
    currentPatient={currentPatient}
    setCurrentPatient={setCurrentPatient}
        />
  );
}
if(page==="loginChoice") {
  return(
    <DoctorOrUser
    setPage={setPage}
    />

  );
}
if(page==="doctorLogin") {
  return(
    <DoctorLogin
    setPage={setPage}
    />
  );
}
if(page==="callNext") {
  return(
    <CallNextPatient
    queue={queue}
    setQueue={setQueue}
    currentPatient={currentPatient}
    setCurrentPatient={setCurrentPatient}/>
  );
}
}
  function DoctorOrUser({setPage}) {
    return (
      <div className="min-h-screen flex flex-col items-center">
    <div className="w-full flex align-center items-center justify-center px-6 py-4 border border-[#2A7C13]">
    <h1 className="text-[#1F5C3A] text-2xl font-bold">🏥 MediQ</h1>
    </div>
    <div className="flex flex-col border border-[#2A7C13] rounded-sm mt-15">
    <div className="flex flex-col items-center ml-30 mr-30 mb-25 mt-10">
      <h1 className="text-[#1F5C3A] text-3xl font-bold">Choose Your Role!</h1>
      <button className="flex align-center justify-center items-center bg-[#1F5C3A] rounded-md h-10 w-60
   mt-6 text-white hover:shadow-md transition duration-300 hover:scale-105 mt-18" onClick={() => {
        setPage("doctorLogin");
      }}>Login as a Doctor</button>
      <button className="flex align-center justify-center items-center bg-[#1F5C3A] rounded-md h-10 w-60
   mt-6 text-white hover:shadow-md transition duration-300 hover:scale-105 mt-10" onClick={() => {
        setPage("patient");
      }}>Continue as a Patient</button>
    </div>
    </div>
    </div>
    )
  }

  function PatientDetails({setPage, fullName,age,setAge,setName,nextToken,setToken,setNextToken,queue,setQueue}) {
    return (
  <div className="min-h-screen flex flex-col items-center">
    <div className="w-full flex align-center items-center justify-center px-6 py-4 border border-[#2A7C13]">
    <h1 className="text-[#1F5C3A] text-2xl font-bold">🏥 MediQ</h1>
    </div>
  <div className="flex flex-col gap-4 items-center w-full mt-6 mb-4" id="headings">
    <h1 className="text-[#1F5C3A] text-2xl font-extrabold">Patient Details</h1>
    <p className="text-[#2A7C13] text-sm">Please enter your details to get a token.</p>
  </div>
  <div className="flex flex-col align-center justify-center gap-3 mt-5" id="detailsSection">
    <h3 className="text-[#1F5C3A] text-base font-medium">👤 Full Name</h3>
    <input type="text" placeholder="Enter your name" className="w-lg text-[#2A7C13] 
    border border-[#1F5C3A] rounded-md" value={fullName} onChange={(e) => setName(e.target.value)}/>
    <h3 className="text-[#1F5C3A] text-base font-medium" >🔒 Age</h3>
    <input type="number" placeholder="Enter your age" className="max-w-lg text-[#2A7C13] 
    border border-[#1F5C3A]  rounded-md" value={age} onChange={(e) => setAge(e.target.value)}/>
  </div>
  <button className="flex align-center justify-center items-center bg-[#1F5C3A] rounded-md h-9 w-60
   mt-6 text-white hover:shadow-md transition duration-300 hover:scale-105" onClick={async () => {
    const patientId= crypto.randomUUID();
    const {data: tokenData, error: tokenError }=
    await supabase.rpc("get_next_token");
    if(tokenError) {
      console.error(tokenError);
      return;
    }
    const newToken=tokenData;
    const {error}=await supabase
    .from("patients")
    .insert([
      {
    id: patientId,
    name: fullName,
    age: Number(age),
    token: newToken,
    status: "waiting"
  }
    ]);
   if(error) {
    console.error(error);
    return;
   }
   localStorage.setItem(
    "mediqPatient",
    JSON.stringify({
      patientId: patientId,
      token: newToken
    })
   );
   setToken(newToken);
  setPage("token");
  }}>Get Token</button>
  <p className="text-[#66756C] text-sm mt-3">Your information is secure and only used for queue management</p>
  </div>
  );
}

function TokenPage({token,setPage,currentPatient}) {
  const isMyTurn=currentPatient && currentPatient.token===token;
  if(isMyTurn) {
    return <YourTurn 
    token={token}
    />
  }
  return(
<div className="min-h-screen flex flex-col items-center">
    <div className="w-full flex align-center items-center justify-center px-6 py-4 border-2 border-[#2A7C13]">
    <h1 className="text-[#1F5C3A] text-2xl font-bold">🏥 MediQ</h1>
    </div>
    <div className="flex items-center justify-center rounded-full bg-[#DDEBDD]  
    w-23 h-23 text-[#1F5C3A] text-4xl font-bold mt-7 mb-5 animate-[popIn_0.5s_ease-out]">✓</div>

    <div className="flex flex-col gap-2 items-center w-full mb-4">
      <h1 className="text-[#1F5C3A] text-2xl font-extrabold animate-[popIn_0.5s_ease-out]">Check-in Successful!</h1>
      <p className="text-[#66756C]">Your token has been generated</p>
    </div>

    <div className=" flex flex-col justify-center align-center items-center 
    w-85 h-33 gap-4 bg-[#DDEBDD] border border-[#1F5C3A] rounded-lg mt-2 ">
      <p className="text-[#1F5C3A] text-sm font-medium">Your Token Number</p>
      <h1 className="text-[#1F5C3A] text-5xl font-bold">{token}</h1>
    </div>

    <div className="flex gap-5 mt-5">
    <div className="flex flex-col justify-center align-center items-center 
    w-40 h-20 gap-1 border-2 border-[#DDEBDD] rounded-lg">
      <p className="text-[#1F5C3A]">Current Token</p>
      <h1 className="text-[#1F5C3A] font-bold">24</h1>
    </div>
    <div className="flex flex-col justify-center align-center items-center 
    w-40 h-20 gap-1 border-2 border-[#DDEBDD] rounded-lg ">
      <p className="text-[#1F5C3A]">People Before You</p>
      <h1 className="text-[#1F5C3A] font-bold">3</h1>
      </div>
    </div>
    <div className=" flex flex-col justify-center align-center items-center 
    max-w-90 min-w-70 h-17 bg-[#DDEBDD] border border-[#1F5C3A] rounded-lg ml-10 mr-10 mt-4">
      <div className="flex gap-2">
        <p className="flex justify-center align-center items-center rounded-full bg-[#DDEBDD] border-2 border-[#1F5C3A] w-4 h-4 text-[#1F5C3A] text-sm font-bold">i</p>
    <p className="text-[#1F5C3A] text-sm">Please wait for your turn.</p>
    </div>
    <p className="text-[#1F5C3A] text-sm">We will notify you when it's your turn</p>
    </div>
    <button onClick={() => {
      setPage("doctor");
    }}>doc dashboard</button>
    <button onClick={() => {
      setPage("patient");
    }}>back to details</button>
    </div>
  );
}

function YourTurn({token}) {
  return(
 <div className="min-h-screen flex flex-col items-center">
    <div className="w-full flex align-center items-center justify-center px-6 py-4 bg-[#DDEBDD] border border-[#1F5C3A]">
    <h1 className="text-[#1F5C3A] text-2xl font-bold">🏥 MediQ</h1>
    </div>
    <div className="flex flex-col justify-center align-center items-center 
    w-[60vh] h-[75vh] gap-4 bg-[#F3F8F2] border-2 border-[#1F5C3A] rounded-lg mt-9">
      <div className="flex items-center justify-center rounded-full bg-[#DDEBDD]  
    w-23 h-23 text-[#1F5C3A] text-5xl font-bold animate-[popIn_0.5s_ease-out] border border-[#1F5C3A]">🕭</div>
      <p className="text-[#1F5C3A] text-4xl font-bold">It's Your Turn!</p>
      <h1 className="text-[#1F5C3A] text-3xl font-medium">Token {token}</h1>
      <p className="text-[#66756C] text-sm">Please proceed to the doctor's room</p>
    </div>
    </div>
  );
}
function DoctorLogin({setPage}) {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error, setError] = useState("");
  return(
    <div className="flex flex-col mt-7 align-center items-center justify-center">
<div className="w-full flex  px-5 py-7 align-center items-center justify-center ">
    <h1 className="text-[#1F5C3A] text-3xl font-bold">🏥 MediQ</h1>
    </div>
    <div className="flex flex-col align-center items-center justify-center mt-5 mb-3">
      <h1 className="text-[#1F5C3A] text-3xl font-medium">Doctor Login</h1>
      <p className="text-[#66756C] text-sm">Enter your credentials to continue</p>
    </div>
    <div className="flex flex-col align-center justify-center gap-4 mt-5" id="detailsSection">
    <h3 className="text-[#1F5C3A] text-base font-bold">📩 Email address</h3>
    <input type="email" value={email} placeholder="doctor@mediq.com" className="w-lg text-[#2A7C13] border 
    border-[#1F5C3A] rounded-md" onChange={(e) => setEmail(e.target.value)}/>
    <h3 className="text-[#1F5C3A] text-base font-bold">🔒 Password</h3>
    <input type="password" value={password} placeholder="Enter your password" className="max-w-lg text-[#2A7C13]
     border border-[#1F5C3A]  rounded-md" onChange={(e) => setPassword(e.target.value)}/>
  </div>
  <div className="flex flex-col align-center items-center mt-3">
    <button className="flex align-center justify-center items-center bg-[#1F5C3A] rounded-md h-9 w-60 mt-6 text-white
  hover:shadow-md transition duration-300 hover:scale-105" onClick={async () => {
    const { data,error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if(error) {
      setError(error.message);
      return;
    }
    setPage("callNext");
  }}>Login</button>
  {error && <p className="text-[#66756C] mt-2">{error}</p>}
  </div>
    </div>
  );
}

function CallNextPatient({queue,setQueue,currentPatient,setCurrentPatient}) {
   useEffect(() => {
    async function fetchPatients() {
      const {data,error} = await supabase 
      .from("patients")
      .select("*")
      .eq("status", "waiting")
      .order("created_at",{ ascending: true});
      
      if(error) {
        console.error(error);
        return;
      }
      setQueue(data);
    }
    fetchPatients();
  }, []);
  return(
    <div className="flex flex-col items-center mt-5" >
        <p className="text-5xl font-bold text-[#1F5C3A]">👤Welcome, Doctor Varshney</p>
<div className=" flex flex-col align-center items-center 
    w-85 h-45 gap-2 bg-[#DDEBDD] border border-[#1F5C3A] rounded-lg mt-11">
      <p className="text-[#1F5C3A] text-sm font-medium">Current Token</p>
      <h1 className="text-[#1F5C3A] text-5xl font-bold">{currentPatient ? currentPatient.token : "--"}</h1>
      <h1 className="text-[#1F5C3A] text-2xl ">{currentPatient ? currentPatient.name : "--"}</h1>
      <button className="flex align-center justify-center items-center bg-[#1F5C3A] rounded-md h-9 w-60 mt-1 text-white
  hover:shadow-md transition duration-300 hover:scale-105" onClick={async () => {
    if(queue.length===0) return;
    const patient=queue[0];
    const {error}=await supabase
    .from ("patients")
    .update({status: "called"})
    .eq("id",patient.id);
    if (error) {
      console.error(error);
      return;
    }
    setCurrentPatient(patient);
    setQueue(queue.slice(1));
  }}>Call Next Patient</button>
    </div>
    <div className="flex flex-col w-100 h-[38vh] mt-7 border border-[#1F5C3A] rounded-md ">
      <p className="ml-2 text-lg font-medium text-[#1F5C3A]">Queue</p>
      {queue.map((patient) => (
        <div key={patient.token} className="flex justify-between mr-2 ml-2 mb-2 items-center border border-[#1F5C3A] rounded-md h-12 ">
          <span className="text-[#1F5C3A] ml-2 font-bold">{patient.token}</span>
          <span className="text-[#1F5C3A] font-medium ">{patient.name}</span>
          <span className="text-red mr-2">Waiting</span>
          </div>
      ))}
    </div>
    </div>
  );
}

export default App
