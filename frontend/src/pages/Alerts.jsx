import { useTranslation } from "react-i18next";

function Alerts() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-4">
          {t("alertsTitle")}
        </h2>

        <p className="text-gray-600 leading-relaxed">
          {t("alertsInfo")}
        </p>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-yellow-800">
          ⚠ Weather-based and advisory alerts will appear here.
        </div>
      </div>
    </div>
  );
}

export default Alerts;