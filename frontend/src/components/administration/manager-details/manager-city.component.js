import { useMutation } from "@apollo/react-hooks";
import React, { useState } from "react";
import CitySelectComponent from "../../filter-components/city-select.component";
import SelectSkeleton from "../../skeleton/skeleton-select";
import { UPDATE_MANAGER_CITIES } from "../../../graphql/mutations/client.mutation";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";

const ManagerCity = ({ manager }) => {

  Array.prototype.pluck = function (key) {
    return this.map(function (object) { return object[key]; });
  };
  const [manage, setManage] = useState(manager);
  const [citi, setCiti] = useState(manage.cities ? manage.cities.pluck("id") : []);

  const [updateCity, { loading }] = useMutation(UPDATE_MANAGER_CITIES, {
    onCompleted: () => {
      closableNotificationWithClick("Информация обновлена", "success");
    }
  });

  const saveCities = () => {
    updateCity(
      {
        variables: {
          id: manager.id,
          cities: citi
        }
      }
    ).then((data) => {
      if (!!data && !!data.data.updateManager) {
        setManage(
          (prevState) => ({
            ...prevState,
            cities: data.data.updateManager.manager.cities
          })
        );
      }
    });
  };

  if (loading) return <SelectSkeleton className="input-group" optionWidth="55" label="Обновление" />;

  return <CitySelectComponent value={citi} setCiti={setCiti} saveCities={saveCities} />;

};

export default ManagerCity;
