from .db import BasicModel
from config import EMPLOYEES_STATUS

POSITIONS = EMPLOYEES_STATUS['position']


class Employee(BasicModel):
    def __init__(self):
        super().__init__(model='employees')

    def get(self, name=None, date=None):
        employees = self.collection.find(sort=[('name', 1)])
        employees_list = []
        for employee in employees:
            if 'email' in employee and employee['email']:
                email = employee['email']
            else:
                email = None
            # 퇴사하지 않은 직원만 포함하기 위해서
            if employee['regular'] != '퇴사':
                employee_info = {'name': employee['name'], 'employeeId': employee['employeeId'], 'email': email, 'regular': employee['regular'], 'mode': employee['mode']}
                if 'beginDate' not in employee and 'endDate' not in employee:
                    employees_list.append(employee_info)
                elif 'beginDate' in employee and date and date >= employee['beginDate'] and 'endDate' not in employee:
                    employees_list.append(employee_info)
                else:
                    if 'endDate' in employee and date and date <= employee['endDate']:
                        employees_list.append(employee_info)
        return employees_list

    def post(self, employee_id=None, name=None, begin_date=None):
        if employee_id and name and begin_date:
            employee = self.collection.find_one({'employeeId': employee_id})
            if not employee:
                self.collection.insert_one({'employeeId': employee_id, 'name': name, 'beginDate': begin_date})