const StatCard = ({ icon: Icon, title, value }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-dark">{value}</p>
        </div>
        <div className={`p-3 rounded-xl text-dark`}>
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
