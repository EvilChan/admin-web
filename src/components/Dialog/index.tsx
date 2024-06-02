import { ComponentType } from "react";
import { createRoot, Root } from "react-dom/client";
import { App, ConfigProvider, ModalProps } from "antd";

type PropsWithModalProps<P = unknown> = P & ModalProps;

export class Dialog<T> {
    el?: HTMLDivElement;
    modalRoot?: Root;
    component: ComponentType<PropsWithModalProps<T>>;

    static create<T>(component: ComponentType<PropsWithModalProps<T>>) {
        return new (class extends Dialog<T> {
            mergedModalProps?: ModalProps;

            constructor() {
                super(component);
            }

            show(props?: T) {
                this.el = document.createElement("div");

                document.body.appendChild(this.el);

                this.modalRoot = createRoot(this.el);

                const Component = this.component;

                const defaultModalProps: ModalProps = {
                    open: true,
                    onCancel: () => this.close(),
                };

                const mergedModalProps = Object.assign({}, defaultModalProps, props);

                this.mergedModalProps = mergedModalProps;

                this.modalRoot.render(
                    <ConfigProvider>
                        <App>
                            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                            {/* @ts-expect-error */}
                            <Component {...(mergedModalProps as T)} />
                        </App>
                    </ConfigProvider>,
                );
            }

            close(fn?: () => void) {
                if (this.modalRoot) {
                    const Component = this.component;

                    const defaultModalProps: ModalProps = {
                        open: false,
                        destroyOnClose: true,
                        afterClose: () => {
                            this.el?.remove();
                            fn?.();
                        },
                    };

                    const mergedModalProps = Object.assign({}, defaultModalProps);

                    this.mergedModalProps = mergedModalProps;

                    this.modalRoot.render(
                        <ConfigProvider>
                            <App>
                                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                                {/* @ts-expect-error */}
                                <Component {...(mergedModalProps as T)} />
                            </App>
                        </ConfigProvider>,
                    );
                }
            }
        })();
    }

    constructor(component: ComponentType<PropsWithModalProps<T>>) {
        this.component = component;
    }
}
