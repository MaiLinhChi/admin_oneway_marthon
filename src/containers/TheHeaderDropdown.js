import React from 'react';
import { useSelector } from 'react-redux';
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react';
import ReduxServices from 'src/common/redux'
import { convertAddressArrToString, detectAddress } from 'src/common/function';
import { CONNECTION_METHOD } from 'src/common/constants';

const TheHeaderDropdown = (props) => {
  const { userData } = props;
  const connectionMethod = useSelector(state => state.connectionMethod)
  
  return (
    <CDropdown
      inNav
      className="c-header-nav-items mx-2"
      direction="down"
    >
      <CDropdownToggle caret={false} className="text-info font-weight-bold">
        {convertAddressArrToString([userData.address], 8, 8)}
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem onClick={() => window.open(detectAddress(userData.address), "_blank")}>
          View Explorer
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdown
