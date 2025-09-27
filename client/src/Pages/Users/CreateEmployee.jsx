import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEmployee } from "../../redux/action/user";
import validator from "email-validator";
import { useNavigate } from "react-router-dom";
import Topbar from "./Topbar";
import {
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  DialogActions,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { PiNotepad, PiXLight } from "react-icons/pi";
import { CFormSelect } from "@coreui/react";
import { pakistanCities } from "../../constant";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const CreateUser = ({ open, setOpen, scroll }) => {
  //////////////////////////////////////// VARIABLES /////////////////////////////////////
  const { isFetching } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const initialEmployeeState = {
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    phone: "",
    email: "",
  }
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  //////////////////////////////////////// STATES /////////////////////////////////////
  const [employeeData, setEmployeeData] = useState(initialEmployeeState);

  //////////////////////////////////////// USE EFFECTS /////////////////////////////////////

  //////////////////////////////////////// FUNCTIONS /////////////////////////////////////
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return
    dispatch(createEmployee(employeeData, setOpen));
    setEmployeeData(initialEmployeeState)
  };

  const validateForm = () => {
  const newErrors = {};

  const rules = {
    firstName: { required: true, min: 3 },
    lastName: { required: true, min: 3 },
    username: { required: true, min: 3 },
    email: { validate: (val) => !val || validator.validate(val), message: "Invalid email" },
    phone: { required: true, min: 5 },
    password: { required: true, min: 6 },
  };

  Object.keys(rules).forEach((field) => {
    const value = employeeData[field];
    const rule = rules[field];

    if (rule.required && !value) newErrors[field] = "This field is required";
    else if (rule.min && value.length < rule.min) newErrors[field] = `Must be at least ${rule.min} characters`;
    else if (rule.validate && !rule.validate(value)) newErrors[field] = rule.message;
  });

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleChange = (field, value) => {
    setEmployeeData((prevFilters) => ({ ...prevFilters, [field]: value, }));
    setErrors({ ...errors, [field]: "" });
  };

  const handleClose = () => {
    setOpen(false);
    setEmployeeData(initialEmployeeState)
  };

  return (
    <div>
      <Dialog
        scroll={scroll}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth="sm"
        maxWidth="sm"
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle className="flex items-center justify-between">
          <div className="text-sky-400 font-primary">Add New Employee</div>
          <div className="cursor-pointer" onClick={handleClose}>
            <PiXLight className="text-[25px]" />
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-2 p-3 text-gray-500 font-primary">
            <div className="text-xl flex justify-start items-center gap-2 font-normal">
              <PiNotepad size={23} />
              <span>Employee Detials</span>
            </div>
            <Divider />
            <table className="mt-4">
              <tr>
                <td className="pb-4 text-lg">First Name </td>
                <td className="pb-4">
                  <TextField
                    size="small"
                    fullWidth
                    value={employeeData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                  />
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">Last Name </td>
                <td className="pb-4">
                  <TextField
                    size="small"
                    fullWidth
                    value={employeeData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                  />
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">User Name </td>
                <td className="pb-4">
                  <TextField
                    size="small"
                    fullWidth
                    value={employeeData.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    error={!!errors.username}
                    helperText={errors.username}
                  />
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">Email </td>
                <td className="pb-4">
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Optional"
                    value={employeeData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </td>
              </tr>
              <tr>
                <td className="flex items-start pt-2 text-lg">Password </td>
                <td className="pb-4">
                  <TextField
                    type="password"
                    value={employeeData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                    size="small"
                    fullWidth
                  />
                </td>
              </tr>
              <tr>
                <td className="flex items-start pt-2 text-lg">Phone </td>
                <td className="pb-4">
                  <TextField
                    type="number"
                    size="small"
                    value={employeeData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    fullWidth
                  />
                </td>
              </tr>
            </table>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleClose}
            variant="contained"
            type="reset"
            className="bg-[#d7d7d7] px-4 py-2 rounded-lg text-gray-500 mt-4 hover:text-white hover:bg-[#6c757d] border-[2px] border-[#efeeee] hover:border-[#d7d7d7] font-thin transition-all">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            variant="contained"
            className="bg-primary-red px-4 py-2 rounded-lg text-white mt-4 hover:bg-red-400 font-thin">
            {isFetching ? 'Submitting...' : 'Submit'}
          </button>
        </DialogActions>
      </Dialog>
    </div>

  );
};

export default CreateUser;
