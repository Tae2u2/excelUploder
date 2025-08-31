import UserCallAmount from "./dashboard/UserCallAmount";
import UserNaverTransfer from "./dashboard/UserNaverTransfer";
import UserSales from "./dashboard/UserSales";

const SalesHome = () => {
  return (
    <div className="w-full ">
      <div className="grid xl:grid-cols-2 grid-cols-1 xl:grid-rows-2 min-h-fit max-h-fit 2xl:max-h-[85vh] place-content-center gap-5 p-3 ">
        <UserSales />
        <UserCallAmount />
        <UserNaverTransfer />
        <div className="flex flex-wrap md:flex-nowrap gap-2 w-full h-full">
          {/* <Calendar /> */}
        </div>
      </div>
    </div>
  );
};

export default SalesHome;
