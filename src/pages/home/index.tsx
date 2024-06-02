import { FC } from "react";
import { Table, TableColumnType, Button, Form, Row, Col, Popconfirm, App } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Data, Params } from "ahooks/es/useAntdTable/types";
import dayjs from "dayjs";
import DynamicInput, { InputType, InputMap } from "@/components/DynamicInput";
import { QueryParams } from "./data";

type TableModel = {
    id: number;
    name: string;
};

type FormItemType<I extends InputType = InputType> = {
    title?: string;
    dataIndex?: string;
    inputType?: I;
    inputProps?: InputMap<I>;
};

const ProductCategories: FC = () => {
    const navigate = useNavigate();

    const { message } = App.useApp();

    const [form] = Form.useForm();

    const formColumns: FormItemType[] = [];

    const columns: TableColumnType<TableModel | undefined>[] = [
        {
            title: "ID",
            dataIndex: "id",
        },
        {
            title: "名称",
            dataIndex: "name",
        },
        {
            title: "操作",
            render: (_, record) => {
                return (
                    <>
                        <Popconfirm
                            title="删除后失效，确定删除吗？"
                            okButtonProps={{ loading: deleteLoading }}
                            onConfirm={() => record && deleteProductCategory(record.id)}
                        >
                            <Button type="link" size="small" danger>
                                删除
                            </Button>
                        </Popconfirm>
                    </>
                );
            },
        },
    ];

    const getTableData = async ({ current, pageSize }: Params[number], queryParams: QueryParams): Promise<Data> => {
        const mergedQueryParams = Object.assign({}, queryParams);

        for (const column of formColumns) {
            if (column.inputType === "daterange" && column.dataIndex) {
                const data = mergedQueryParams[column.dataIndex.toString()];
                if (Array.isArray(data)) {
                    mergedQueryParams[`${column.dataIndex}_start`] = dayjs.isDayjs(data[0])
                        ? (data[0] as dayjs.Dayjs).format("YYYY-MM-DD")
                        : "";
                    mergedQueryParams[`${column.dataIndex}_end`] = dayjs.isDayjs(data[1])
                        ? (data[1] as dayjs.Dayjs).format("YYYY-MM-DD")
                        : "";
                    delete mergedQueryParams[column.dataIndex.toString()];
                }
            } else if (column.inputType === "datetimerange" && column.dataIndex) {
                const data = mergedQueryParams[column.dataIndex.toString()];
                if (Array.isArray(data)) {
                    mergedQueryParams[`${column.dataIndex}_start`] = dayjs.isDayjs(data[0])
                        ? (data[0] as dayjs.Dayjs).format("YYYY-MM-DD HH:mm") + ":00"
                        : "";
                    mergedQueryParams[`${column.dataIndex}_end`] = dayjs.isDayjs(data[1])
                        ? (data[1] as dayjs.Dayjs).format("YYYY-MM-DD HH:mm") + ":59"
                        : "";
                    delete mergedQueryParams[column.dataIndex.toString()];
                }
            }
        }

        const res = await Promise.resolve({
            data: {
                total: 1,
                list: [
                    {
                        id: 1,
                        name: "test",
                        current,
                        pageSize,
                    },
                ],
            },
        });
        if (res.data) {
            return {
                total: res.data.total,
                list: res.data.list,
            };
        } else {
            return {
                total: 0,
                list: [],
            };
        }
    };

    const { tableProps, search } = useAntdTable(getTableData, {
        form,
    });

    const { submit } = search;

    const { loading: deleteLoading, runAsync: deleteRunAsync } = useRequest(
        async (id: number) => {
            return Promise.resolve({
                code: "SUCCESS",
                msg: id,
            });
        },
        {
            manual: true,
        },
    );

    const deleteProductCategory = async (id: number) => {
        const res = await deleteRunAsync(id);
        if (res.code === "SUCCESS") {
            message.success(res.msg);
            submit();
        }
    };

    const renderForm = (columns: FormItemType[]) => {
        return (
            <Form
                labelCol={{
                    span: 5,
                }}
                wrapperCol={{
                    span: 19,
                }}
                form={form}
            >
                <Row>
                    {columns
                        .filter((column) => column.inputType)
                        .map((column) => {
                            return (
                                <Col
                                    xs={{
                                        span: 24,
                                    }}
                                    sm={{
                                        span: 24,
                                    }}
                                    md={{
                                        span: 24,
                                    }}
                                    lg={{
                                        span: 12,
                                    }}
                                    xl={{
                                        span: 8,
                                    }}
                                    xxl={{
                                        span: 6,
                                    }}
                                    key={column.dataIndex?.toString()}
                                >
                                    <Form.Item label={column.title?.toString()} name={column.dataIndex?.toString()}>
                                        <DynamicInput
                                            inputType={column.inputType}
                                            style={{
                                                width: "100%",
                                            }}
                                            allowClear
                                            {...column.inputProps}
                                        />
                                    </Form.Item>
                                </Col>
                            );
                        })}
                </Row>
            </Form>
        );
    };

    const renderActions = () => {
        return (
            <div className="flex items-center pb-6">
                <div className="flex-1">
                    <Button.Group>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/home/create")}>
                            添加
                        </Button>
                    </Button.Group>
                </div>
            </div>
        );
    };

    const renderTable = () => {
        return (
            <Table
                {...tableProps}
                rowKey={"id"}
                columns={columns}
                loading={false}
                size="small"
                pagination={{
                    ...tableProps.pagination,
                    showSizeChanger: true,
                    showTotal: (total) => `共 ${total} 条`,
                }}
            />
        );
    };

    return (
        <div className="p-4 bg-white">
            {renderForm(formColumns)}
            {renderActions()}
            {renderTable()}
        </div>
    );
};

export default ProductCategories;
