using AutoMapper;
using PasswordPolicy.Dtos;
using PasswordPolicy.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PasswordPolicy.Profiles
{
    public class PasswordProfile : Profile
    {
        public PasswordProfile()
        {
            //source -> Target
            CreateMap<Password, PasswordDto>().ReverseMap();
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<Employee, CreateEmployeeDto>().ReverseMap();
            CreateMap<UpdateEmployeeDto, Employee>().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
