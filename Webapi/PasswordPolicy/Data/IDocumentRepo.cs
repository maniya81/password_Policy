using PasswordPolicy.Models;
using System.Collections.Generic;

namespace PasswordPolicy.Data
{
    public interface IDocumentRepo
    {
        void CreateDocument(Document doc);
        IEnumerable<Document> GetAll();
        Document GetById(int id);
        void Delete(int id);
    }
}
