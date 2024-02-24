from .db import BasicModel

class Employee(BasicModel):
    def __init__(self):
        super().__init__(model='employees')

    def get_list(self, date=None):
        employees = self.collection.find(sort=[('name', 1)])
        employees_list = []
        for employee in employees:
            # 퇴사하지 않은 직원만 포함
            if employee['regular'] != '퇴사':            
                employee_info = {'name': employee['name'], 'employeeId': employee['employeeId'], 'regular': employee['regular'], 'mode': employee['mode'], 'attendMode': employee['attendMode']}
                if date:
                    if (date >= employee['beginDate'] and 'endDate' not in employee) or ('endDate' in employee and date <= employee['endDate']):
                        employees_list.append(employee_info)
                else:
                    employees_list.append(employee_info)
        return employees_list