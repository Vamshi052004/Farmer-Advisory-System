import { useTranslation } from "react-i18next";

function Alerts() {
  const { t } = useTranslation();

  return (
    <div className="page-container">
      <div className="card">
        <h2>{t("alertsTitle")}</h2>
        <p>{t("alertsInfo")}</p>
      </div>
    </div>
  );
}

export default Alerts;
