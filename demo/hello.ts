/// <reference path="./../typings/ng2-formly.d.ts" />
import {Component} from "@angular/core";
import {Validators} from "@angular/common";
import {bootstrap} from "@angular/platform-browser-dynamic";
import {FormlyForm} from "./../src/components/formly.form";
import {ValidationService} from "./validation.service";
import {FormlyProviders} from "./../src/services/formly.providers";
import {FormlyMessages} from "./../src/services/formly.messages";
import { FormlyEventEmitter } from "./../src/services/formly.event.emitter";
import {FormlyConfig} from "./../src/services/formly.config";
import {TemplateDirectives} from "./../src/templates/templates";
import {FormlyBootstrap} from "./../src/templates/formlyBootstrap";
import { Field } from "./../src/templates/field";
import {FormlyPubSub} from "./../src/services/formly.event.emitter";


// Custom Input Field type 'toggle' Component Definition
@Component({
  selector: "formly-field-toggle",
  template: `
    <div [ngFormModel]="form">
      <div class="checkbox-toggle">
          <input id="checkbox" type="checkbox" type="checkbox" [ngControl]="key" (change)="inputChange($event, 'checked')" value="on">
          <label for="checkbox">
              <div></div>
          </label>
      </div>
  </div>
  `
})
export class FormlyFieldToggle extends Field {

  constructor(fm: FormlyMessages, ps: FormlyPubSub) {
    super(fm, ps);
  }

}


/*************************************************************
    Interface for FormlyFields and FormlyTemplateOptions
 *************************************************************/

    interface FormlyTemplateOptions {
        type?: string;
        label?: string;
        placeholder?: string;
        disabled?: Boolean;
        options?: Array<any>;
        rows?: number;
        cols?: number;
        description?: string;
        focus?: boolean;
    }
    interface FormlyFields {
        key?: string;
        className?: string;
        fieldGroup?: Array<FormlyFields>;
        type?: string;
        templateOptions?: FormlyTemplateOptions;
        validation?: Validators;
        template?: string;
        expressionProperties?: Object;
        hideExpression?: boolean;
    }

@Component({
    directives: [FormlyForm],
    selector: "hello-app",
    templateUrl: "../demo/template.html",
    providers: [FormlyConfig, FormlyMessages]
})
export class HelloApp {
    form;
    Stream;
    author;
    env;
    constructor(fm: FormlyMessages, fc: FormlyConfig) {

        fm.addStringMessage("required", "This field is required.");
        fm.addStringMessage("invalidEmailAddress", "Invalid Email Address");
        fm.addStringMessage("maxlength", "Maximum Length Exceeded.");
        fm.addStringMessage("minlength", "Should have atleast 2 Characters");

        ["input", "checkbox", "radio", "select", "textarea"].forEach(function (field) {
            fc.setType({
                name: field,
                component: TemplateDirectives[field]
            });
        });
        this.author = {
          name: "Mohammed Zama Khan",
          url: "https://www.github.com/mohammedzamakhan"
        };
        this.env = {
          angularVersion: "2.0.0-beta.14",
          formlyVersion: "2.0.0-alpha.1"
        };
        fc.setType({
          name: "toggle",
          component: FormlyFieldToggle
        });

        this.Stream = new FormlyEventEmitter();

        setTimeout(() => {

            this.userFields = [{
                type: "radio",
                key: "title",
                templateOptions: {
                    options: [{
                        key: "mr",
                        value: "Mr."
                    }, {
                        key: "mrs",
                        value: "Mrs"
                    }],
                    label: "Title",
                    description: "Select a title that suits your description"
                }
            }, {
                className: "row",
                fieldGroup: [{
                    className: "col-xs-4",
                    key: "email",
                    type: "input",
                    templateOptions: {
                        type: "email",
                        label: "Email address",
                        placeholder: "Enter email",
                        disabled: true
                    },
                    validation: Validators.compose([Validators.required, ValidationService.emailValidator]),
                    expressionProperties: {
                        "templateOptions.disabled": "!model.password"
                    }
                }, {
                    className: "col-xs-4",
                    key: "password",
                    type: "input",
                    templateOptions: {
                        type: "password",
                        label: "Password",
                        placeholder: "Password",
                        focus: true
                    },
                    validation: Validators.compose([Validators.required, Validators.maxLength(10), Validators.minLength(2)])
                }, {
                    className: "col-xs-4",
                    key: "select",
                    type: "select",
                    templateOptions: {
                        options: [{
                            label: "Male",
                            value: "male"
                        }, {
                            label: "Female",
                            value: "female"
                        }],
                        label: "Gender",
                        placeholder: "Select Gender"
                    }
                }]
            }, {
                className: "section-label",
                template: "</hr /><div><strong>Address:</strong></div>"
            }, {
                className: "row",
                fieldGroup: [{
                    className: "col-xs-6",
                    type: "input",
                    key: "street",
                    templateOptions: {
                        label: "Street",
                        placeholder: "604 Causley Ave. ",
                        description: "Enter a valid US Address"
                    }
                }, {
                    className: "col-xs-3",
                    type: "input",
                    key: "city",
                    templateOptions: {
                        label: "City",
                        placeholder: "Arlington"
                    }
                }, {
                    className: "col-xs-3",
                    type: "input",
                    key: "zip",
                    templateOptions: {
                        type: "number",
                        label: "Zip",
                        placeholder: "76010"
                    }
                }]
            }, {
                key: "checked",
                type: "checkbox",
                templateOptions: {
                    label: "Check me out",
                    description: "If you want to check me out, check this box"
                }
            }, {
              key: "textAreaVal",
              type: "textarea",
              templateOptions: {
                rows: 5,
                cols: 20,
                placeholder: "Type a paragraph...",
                label: "Message",
                description: "Please enter atleast 150 characters"
              }
            }, {
              key: "toggleVal",
              type: "toggle",
              templateOptions: {

              }
            }];

            this.user = {
                email: "email@gmail.com",
                checked: true,
                select: "male",
                title: "Mr.",
                toggleVal: true
            };
            this.Stream.emit({
                model: this.user,
                fields: this.userFields
            });
        }, 0);
    }
    user: any = {};
    private userFields: Array<FormlyFields> = [];

  console(data) {
      console.log(data);
  }

  showEmail() {
      this.user.email = "mohammedzamakhan";
      this.user.checked = !this.user.checked;
      this.Stream.emit({
          model: this.user
      });
  }
hide() {
    console.log(this.userFields);
    this.userFields[1].fieldGroup[0].hideExpression = !this.userFields[1].fieldGroup[0].hideExpression;
}

  changeEmail() {
      this.Stream.emit({});
  }
  submit(user) {
      console.log(user);
  }
}

bootstrap(HelloApp, [FormlyBootstrap, FormlyProviders]);