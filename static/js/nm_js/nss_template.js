function nss_template_list(url) {
    axios.get(url + 'ObjectManagement/SliceTemplate/').then((response) => {
        var response = response.data;
        for (var i = 0; i < response.length; i++) {
            templateId = response[i].templateId;
            document.getElementById("nrm_table").innerHTML += '\
          <tr>\
            <td>' + templateId + '</td>\
            <td>' + response[i].description + '</td>\
            <td>' + response[i].nfvoType + '</td>\
            <td align="center"><a href="#" class="btn btn-info btn-circle" data-toggle="modal" data-target="#generic_templates_Modal' + templateId + '"><i class="fas fa-file-alt text-white"></i></a></td>\
            <td align="center"><a href="#" onclick="delete_template(\'' + url + 'ObjectManagement/SliceTemplate/\',\'' + templateId + '\')" class="btn btn-danger btn-circle"><i class="fas fa-trash"></i></a></td>\
          </tr>';
            document.getElementById("generic_templates_Modal").innerHTML += '\
        <div class="modal fade" id="generic_templates_Modal' + templateId + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">\
          <div class="modal-dialog" role="document">\
            <div class="modal-content">\
              <div class="modal-header">\
                <h5 class="modal-title" id="exampleModalLabel">VNF List</h5>\
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">\
                  <span aria-hidden="true">×</span>\
                </button>\
              </div>\
              <div class="modal-body">\
                <label for="update_template_id">NSD Template ID :</label><input type="text" class="form-control bg-light border-0 small" name="update_template_id" id="update_template_id" required readonly value="' + templateId + '">\
                <label>VNF ID List :\
                  <table id="generic_templates_list_' + templateId + '">\
                    <tr></tr>\
                  </table>\
                </label>\
              </div>\
              <div class="modal-footer">\
                <button class="btn btn-secondary" type="button" data-dismiss="modal">Close</button>\
              </div>\
            </div>\
          </div>\
        </div>';
            for (var j = 0; j < response[i].genericTemplates.length; j++) {
                genericTemplatesId = response[i].genericTemplates[j].templateId;
                 document.getElementById("generic_templates_list_" + templateId).innerHTML += '<td>' + genericTemplatesId + '</td>';
            }
        }
    });
}


function delete_template(url, name) {
    var yes = confirm("Sure to delete NSS Template ?");
    if (yes) {
        axios.delete(url + name + '/').then((response) => {
            alert("NRM Template Delete Success");
            location.reload();
        })
            .catch((error) => {
                console.log(error);
                alert("ERROR!!");
            });
    }
}


var file;

function upload(e) {
    file = e.files[0];
    if (!file) {
        return;
    }
    console.log(file);
}

function create_template(url) {
    var vnf_id = document.getElementById("vnf_template").value;
    var nsd_id = document.getElementById("nsd_template").value;
    var nrm_id = document.getElementById("nrm_template").value;
    var nfvoType = document.getElementById("nfvoType").value;
    var description = document.getElementById("description").value;
    var form = new FormData();
    form.append("nfvoType", nfvoType);
    form.append("genericTemplates", vnf_id);
    form.append("genericTemplates", nsd_id);
    form.append("genericTemplates", nrm_id);
    form.append("description", description);
    if (nfvoType && vnf_id && nsd_id && nrm_id) {
        axios.post(url + 'ObjectManagement/SliceTemplate/', form)
            .then((response) => {
                alert("NSSTemplate Create Success !!");
                location.reload();
            })
            .catch((error) => {
                console.log(error);
                alert("ERROR!!");
            });
    } else {
        alert("Please select a NFVO or VNF or NSD or NRM!");
    }
}


function show_update_template(url, name, nfvoType) {
    document.getElementById("update_template_Modal").innerHTML = '\
  <div class="modal-dialog" role="document">\
    <div class="modal-content">\
      <div class="modal-header">\
        <h5 class="modal-title" id="exampleModalLabel">Update NRM Template</h5>\
        <button class="close" type="button" data-dismiss="modal" aria-label="Close">\
          <span aria-hidden="true">×</span>\
        </button>\
      </div>\
      <div class="modal-body">\
        <label for="update_template_id">NRM Template ID :</label><input type="text" class="form-control bg-light border-0 small" name="update_template_id" id="update_template_id" required readonly value="' + name + '"><br>\
        <label for="templateFile">NRM Template File :</label><br><input class="btn btn-secondary btn-icon-split" name="templateFile" id="templateFile" type="file" accept=".zip" onchange="upload(this)" required></div>\
      <div class="modal-footer">\
        <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>\
        <a class="btn btn-primary" href="#" onclick="update_template(\'' + url + '\',\'' + nfvoType + '\')">Update</a>\
      </div>\
    </div>\
  </div>';
}


function update_template(url, nfvoType) {
    var name = document.getElementById("update_template_id").value;
    if (file && name) {
        var form = new FormData();
        form.append("nfvoType", nfvoType);
        form.append("templateType", "NRM");
        form.append("templateFile", file);
        axios.put(url + name + '/', form)
            .then((response) => {
                alert("Template update success！");
                location.reload();
            })
            .catch((error) => {
                alert("NRM Template model has some error.");
            });
    } else {
        alert("Please enter Template ID and Template File");
    }
}


function get_plugin_list(url) {
    axios.get(url + 'plugin/management/').then((response) => {
        var response = response.data;
        if (response.length == 0) {
            document.getElementById("nfvoType").innerHTML = '<option value="">Create NFVO first</option>';
        } else {
            document.getElementById("nfvoType").innerHTML = '<option value="">Select a NFVO</option>';
            for (var i = 0; i < response.length; i++) {
                document.getElementById("nfvoType").innerHTML += '\
        <option value="' + response[i].name + '">' + response[i].name + '</option>';
            }
        }
    });
}

function get_generic_template_list(url) {
    axios.get(url + 'ObjectManagement/GenericTemplate/').then((response) => {
        var response = response.data;
        if (response.length == 0) {
            document.getElementById("vnf_template").innerHTML = '<option value="">Create VNF first</option>';
            document.getElementById("nsd_template").innerHTML = '<option value="">Create NSD first</option>';
            document.getElementById("nrm_template").innerHTML = '<option value="">Create NRM first</option>';
        } else {
            document.getElementById("vnf_template").innerHTML = '<option value="">Select a VNF</option>';
            document.getElementById("nsd_template").innerHTML = '<option value="">Select a NSD</option>';
            document.getElementById("nrm_template").innerHTML = '<option value="">Select a NRM</option>';
            for (var i = 0; i < response.length; i++) {
                if (response[i].templateType == "VNF" && response[i].operationStatus == "UPLOAD") {
                    document.getElementById("vnf_template").innerHTML += '\
        <option value="' + response[i].templateId + '">' + response[i].name + '</option>';
                }
                if (response[i].templateType == "NSD" && response[i].operationStatus == "UPLOAD") {
                    document.getElementById("nsd_template").innerHTML += '\
        <option value="' + response[i].templateId + '">' + response[i].name + '</option>';
                }
                if (response[i].templateType == "NRM" && response[i].operationStatus == "UPLOAD") {
                    document.getElementById("nrm_template").innerHTML += '\
        <option value="' + response[i].templateId + '">' + response[i].name + '</option>';
                }

            }
        }
    });
}
