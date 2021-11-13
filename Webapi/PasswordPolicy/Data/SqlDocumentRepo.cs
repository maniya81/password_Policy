using Microsoft.AspNetCore.WebUtilities;
using PasswordPolicy.Dtos;
using PasswordPolicy.EmailService;
using PasswordPolicy.Helpers;
using PasswordPolicy.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
namespace PasswordPolicy.Data
{
    public class SqlDocumentRepo : IDocumentRepo
    {
        private PasswordContext _context;

        public SqlDocumentRepo(PasswordContext context)
        {
            _context = context;
        }


        public IEnumerable<Document> GetAll()
        {
            return _context.Documents.ToList();
        }

        public Document GetById(int id)
        {
            return _context.Documents.Find(id);
        }

        public void CreateDocument(Document doc)
        {
            doc.UploadDate = DateTime.Now;
            _context.Documents.Add(doc);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var doc = _context.Documents.Find(id);
            if (doc != null)
            {
                _context.Documents.Remove(doc);
                _context.SaveChanges();
            }
        }

    
    }

}
