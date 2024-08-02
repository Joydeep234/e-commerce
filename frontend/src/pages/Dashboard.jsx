import axios from "axios";
const Dashboard = () => {
    const handleSubmit = async (e) => {
      try {
        e.preventDefault();
        const res = await axios.get("/api/woofers/logout");
        console.log("response is", res);
        
      } catch (error) {
        console.log("signup-error", error);
        alert("try again after some time");
      }
    };
  return (
    <>
      <button
        type="submit"
        className="w-max h-10 rounded-md my-3 text-lg bg-slate-500 px-5 text-white"
        onClick={handleSubmit}
      >
        Logout
      </button>
    </>
  );
}

export default Dashboard;
