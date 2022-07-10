// import { useState } from "react";
import { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Form } from "semantic-ui-react";
import { Formik } from "formik";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { DataGrid } from "@mui/x-data-grid";

import ConfirmDialog from "pages/components/dialog/ConfirmDialog";
import {
  viewDetailOfflineOrder,
  approveOnlineOrderAction,
  cancelOnlineOrderAction,
} from "../../../redux/actions/orderAction";
import { SchemaErrorMessageOnlineOrderAssign } from "../../../service/Validations/OrderAssignValidation";

import { listStaffInStoreAction } from "../../../redux/actions/staffAction";
import { triggerReload } from "../../../redux/actions/userAction";
import Loading from "../../../components/Loading";
import "./viewOnlineOrder.css";
import {
  APPROVE_ONLINE_ORDER_SUCCESS,
  APPROVE_ONLINE_ORDER_FAIL,
  CANCEL_ONLINE_ORDER_SUCCESS,
  CANCEL_ONLINE_ORDER_FAIL,
} from "../../../service/Validations/VarConstant";

export default function OfflineOrderForm() {
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", subTitle: "" });

  const { onlineOrderId } = useParams();
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.viewDetailOfflineOrder);
  const approveOnOrder = useSelector((state) => state.approveOnlineOrder);
  const rejectOnOrder = useSelector((state) => state.rejectOnlineOrder);
  const staffDropdown = useSelector((state) => state.getListStaffDropDown);
  const { product_list, store, order_id, create_date, status } = data;

  console.log(data);
  console.log(approveOnOrder);

  useEffect(() => {
    dispatch(viewDetailOfflineOrder(onlineOrderId));
    dispatch(listStaffInStoreAction());
  }, [dispatch, triggerReload]);

  useEffect(() => {
    if (approveOnOrder.success) {
      toast.success("Thao tác thành công");
      dispatch({ type: APPROVE_ONLINE_ORDER_SUCCESS, payload: false });
    }
    if (approveOnOrder.error) {
      toast.error("Thao tác thất bại, vui lòng thử lại");
      dispatch({ type: APPROVE_ONLINE_ORDER_FAIL, payload: false });
    }
  }, [triggerReload, approveOnOrder.success, approveOnOrder.error]);

  useEffect(() => {
    if (rejectOnOrder.success) {
      toast.success("Thao tác thành công");
      dispatch({ type: CANCEL_ONLINE_ORDER_SUCCESS, payload: false });
    }
    if (rejectOnOrder.error) {
      toast.error("Thao tác thất bại, vui lòng thử lại");
      dispatch({ type: CANCEL_ONLINE_ORDER_FAIL, payload: false });
    }
  }, [triggerReload, rejectOnOrder.success, rejectOnOrder.error]);

  const onSubmit = (result) => {
    // console.log(result);
    dispatch(approveOnlineOrderAction(order_id, result));
  };

  const handleCancel = (id) => {
    dispatch(cancelOnlineOrderAction(id));
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
  };

  // const handleAccept = (id) => {
  //   // dispatch(approveOfflineOrderAction(id));
  //   console.log(id);
  //   setConfirmDialog({
  //     ...confirmDialog,
  //     isOpen: false,
  //   });
  // };

  const columns = [
    {
      field: "product_detail_id",
      headerName: "Mã sản phẩm",
      width: 100,
    },
    {
      field: "product_name",
      headerName: "Sản phẩm",
      width: 350,
      renderCell: (params) => (
        <div className="productListItem">
          <img
            className="productListImg"
            src={params.row.product_image_url}
            alt={params.row.product_name}
          />
          {params.row.product_name}&emsp;&emsp;
          {params.row.category}&emsp;&emsp;
          {params.row.colour}&emsp;&emsp;
          {params.row.size}&emsp;&emsp;
        </div>
      ),
    },
    {
      field: "price",
      headerName: "Đơn giá",
      width: 150,
      renderCell: (params) => <div>{params.row.price.toLocaleString("vi-VN")}</div>,
    },
    {
      field: "quantity",
      headerName: "Số lượng",
      width: 250,
    },
    {
      field: "total_quantity_price",
      headerName: "T.Tiền",
      width: 250,
      renderCell: (params) => (
        <div className="onlineOrderItem">{`${(
          params.row.price * params.row.quantity
        ).toLocaleString("vi-VN")}`}</div>
      ),
    },
  ];

  return (
    <div>
      {loading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div className="onlineOrder">
          <Formik
            initialValues={{
              staff: "",
            }}
            onSubmit={onSubmit}
            validationSchema={SchemaErrorMessageOnlineOrderAssign}
            validateOnBlur
            validateOnChange
          >
            {(formik) => {
              console.log(formik);
              return (
                <div>
                  <Form onSubmit={formik.handleSubmit}>
                    <Grid container>
                      <Grid item xs={6}>
                        <div className="container-title">
                          <div className="title">Ngày bán:</div>
                          <div className="content">&emsp;{create_date}</div>
                        </div>
                        <div className="container-title">
                          <div className="title">Hóa đơn:</div>
                          <div className="content">&emsp;{order_id}</div>
                        </div>
                        <div className="container-title">
                          <div className="title">Nhân viên phụ trách:&emsp;</div>
                          <div className="content">
                            {staffDropdown.loading ? (
                              <Loading />
                            ) : (
                              <div>
                                {data.staff_name ? (
                                  <Form.Select
                                    fluid
                                    // options={staffDropdown.data || []}
                                    placeholder="Nhân viên"
                                    onChange={(e, v) => {
                                      formik.setFieldValue("staff", v.value);
                                    }}
                                    name="staff"
                                    value={formik.values.staff}
                                    error={formik.errors.staff}
                                    text={data.staff_name}
                                  />
                                ) : (
                                  <Form.Select
                                    fluid
                                    options={staffDropdown.data || []}
                                    placeholder="Nhân viên"
                                    onChange={(e, v) => {
                                      formik.setFieldValue("staff", v.value);
                                    }}
                                    name="staff"
                                    value={formik.values.staff}
                                    error={formik.errors.staff}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </Grid>
                      <Grid item xs={6}>
                        <div className="container-title">
                          <div className="title">Cửa hàng:</div>
                          <div className="content">
                            &emsp;{store.store_name} &emsp; {store.store_phone}
                          </div>
                        </div>
                        <div className="container-title">
                          <div className="title">Địa chỉ:</div>
                          <div className="content">{store.store_address}</div>
                        </div>
                      </Grid>
                    </Grid>
                    <DataGrid
                      sx={{
                        "&.MuiDataGrid-root .MuiDataGrid-cell:focus": {
                          outline: "none",
                        },
                        "& .MuiDataGrid-cell:hover": {
                          color: "green",
                        },
                      }}
                      getRowId={(r) => r.product_detail_id}
                      loading={loading}
                      rows={product_list}
                      disableSelectionOnClick
                      columns={columns}
                      pageSize={8}
                      data={(query) =>
                        new Promise(() => {
                          console.log(query);
                        })
                      }
                    />
                    {status === "Chờ xác nhận" ? (
                      <Stack className="bottom-button" direction="row" spacing={2}>
                        <div>
                          <Button
                            className="deny"
                            variant="outlined"
                            disabled={formik.isSubmitting}
                            onClick={() =>
                              setConfirmDialog({
                                isOpen: true,
                                title: "Bạn có muốn hủy đơn hàng này?",
                                subTitle: "Xác nhận",
                                onConfirm: () => {
                                  handleCancel(order_id);
                                },
                              })
                            }
                          >
                            Hủy
                          </Button>
                          <Button
                            className="approve"
                            variant="outlined"
                            type="submit"
                            disabled={formik.isSubmitting}
                            // onClick={() =>
                            //   setConfirmDialog({
                            //     isOpen: true,
                            //     title: "Bạn có muốn xác nhận đơn hàng này?",
                            //     subTitle: "Xác nhận",
                            //     onConfirm: () => {
                            //       handleAccept(order_id, formik.errors.staff);
                            //     },
                            //   })
                            // }
                          >
                            Xác nhận
                          </Button>
                        </div>
                      </Stack>
                    ) : (
                      <div />
                    )}
                  </Form>
                </div>
              );
            }}
          </Formik>
        </div>
      )}
      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </div>
  );
}
