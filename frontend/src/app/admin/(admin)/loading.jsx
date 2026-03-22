


const loading = () => {
  return (
<>
 
    {/* -------- */}
    <div className="w-full bg-[#000000cf] min-h-screen ">
      <div className="absolute w-full bottom-0 left-0 h-1 rounded-t-xl">
      {/* <div className="w-[30%] bg-[#00e600] h-full animate-progressBar"></div> */}
    </div>
 

  <div className="flex  p-8 justify-center items-center h-[450px]">
    <div className="text-center space-y-6">
     <div className="relative w-28 h-28 mx-auto">

</div>

      <div className="text-[#9e9e9e]  text-sm opacity-80 animate-fadeIn">
        <p>We're getting everything ready for you...</p>
        <p>Sit tight for just a moment.</p>
      </div>
    </div>
  </div>

  <div className=" p-4 text-center text-gray-400 text-xs font-mono">
    <p>Appreciate your patience. Almost there!</p>
  </div>

    </div>

</>

  )
}

export default loading

