import React from "react";
import Switch from "rc-switch";
import { useMutation } from "@apollo/react-hooks";

const Toggler = ({ id, active, mutation }) => {
  const [updateActivity, { loading, error }] = useMutation(mutation);

  const handleToggle = (event) => {
    updateActivity({ variables: { id, active: event } });
  };

  return (
    <React.Fragment>
      <Switch
        id={id}
        className="default-switch"
        name="active"
        onChange={handleToggle}
        defaultChecked={active}
      />
      {loading && <p>Loading...</p>}
      {error && <p>Error :( Please try again</p>}
    </React.Fragment>
  );
};

export default Toggler;
