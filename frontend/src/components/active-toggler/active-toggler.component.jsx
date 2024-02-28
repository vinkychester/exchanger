import React, { useEffect, useState } from "react";
import Switch from "rc-switch";

import Spinner from "../spinner/spinner.component";
import { StyledActiveToggler } from "./styled-active-toggler";
import Confirmation from "../confirmation/confirmation";

const ActiveToggler = ({ id, name, value, text, action, loading, error }) => {
  const [activeConfirmation, setActiveConfirmation] = useState(false);
  const [checked, setChecked] = useState(value);

  const handleToggleActivity = () => {
    action({ variables: { id, [name]: !checked } });
    setChecked(!checked);
  };

  useEffect(() => {
      setChecked(value === true);
    }, [value]
  );
  
  return (
    <StyledActiveToggler>
      {activeConfirmation && (
        <Confirmation
          question={text} //"Вы действительно хотите изменить активность пары?"
          handler={handleToggleActivity}
          setVisible={setActiveConfirmation}
          visible={activeConfirmation}
        />
      )}
      <Switch
        className="default-switch"
        name="active"
        checked={checked}
        onClick={() => setActiveConfirmation(!activeConfirmation)}
        defaultChecked={checked}
      />
      {loading && <Spinner color="#EC6110" type="moonLoader" size="17px" />}
      {error && <p>Error :( Please try again</p>}
    </StyledActiveToggler>
  );
};

export default ActiveToggler;
