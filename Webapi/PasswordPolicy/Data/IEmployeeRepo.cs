using PasswordPolicy.Models;
using System.Collections.Generic;

namespace PasswordPolicy.Data
{
    public interface IEmployeeRepo
    {
        bool SaveChanges();
        IEnumerable<Employee> GetAll();
        void CreateEmployee(Employee emp);
        Employee GetEmployeeById(int id);
        void UpdateEmployee(Employee emp);
        void DeleteEmployee(Employee emp);
    }
}
